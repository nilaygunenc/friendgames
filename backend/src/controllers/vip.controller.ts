import { Request, Response } from 'express';
import crypto from 'crypto';
import { pool } from '../db/pool';

/**
 * RevenueCat webhook — satın alma/yenileme olaylarında çağrılır.
 * Webhook secret ile HMAC-SHA256 imzası doğrulanır.
 */
export async function revenuecatWebhook(
  req: Request,
  res: Response
): Promise<void> {
  const signature = req.headers['x-revenuecat-signature'] as string;
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;

  if (!secret) {
    res.status(500).json({ error: 'Webhook secret not configured' });
    return;
  }

  // Verify signature
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (!signature || signature !== expected) {
    res.status(401).json({ error: 'Invalid webhook signature' });
    return;
  }

  const { event } = req.body as {
    event: {
      type: string;
      app_user_id: string;
      product_id: string;
      purchased_at_ms: number;
      expiration_at_ms?: number;
      transaction_id: string;
    };
  };

  const {
    type,
    app_user_id,
    product_id,
    purchased_at_ms,
    expiration_at_ms,
    transaction_id,
  } = event;

  const isActive =
    type === 'INITIAL_PURCHASE' ||
    type === 'RENEWAL' ||
    type === 'UNCANCELLATION';

  const isRevoked = type === 'CANCELLATION' || type === 'EXPIRATION';

  try {
    if (isActive) {
      const expiresAt = expiration_at_ms
        ? new Date(expiration_at_ms)
        : null;

      await pool.query(
        `UPDATE users
         SET is_vip = TRUE, vip_expires_at = $1, updated_at = NOW()
         WHERE id = $2`,
        [expiresAt, app_user_id]
      );

      await pool.query(
        `INSERT INTO vip_purchases
           (user_id, platform, transaction_id, product_id, purchased_at, expires_at, revenuecat_customer)
         VALUES ($1, 'revenuecat', $2, $3, $4, $5, $6)
         ON CONFLICT (transaction_id) DO NOTHING`,
        [
          app_user_id,
          transaction_id,
          product_id,
          new Date(purchased_at_ms),
          expiresAt,
          app_user_id,
        ]
      );

      console.log(`✅ VIP activated for user ${app_user_id}`);
    } else if (isRevoked) {
      await pool.query(
        `UPDATE users
         SET is_vip = FALSE, vip_expires_at = NULL, updated_at = NOW()
         WHERE id = $1`,
        [app_user_id]
      );

      console.log(`❌ VIP revoked for user ${app_user_id}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('revenuecatWebhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
