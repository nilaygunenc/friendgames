import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool';

const SALT_ROUNDS = 12;

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, displayName } = req.body as {
    email: string;
    password: string;
    displayName: string;
  };

  try {
    // Check existing user
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if ((existing.rowCount ?? 0) > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3) RETURNING id`,
      [email.toLowerCase(), passwordHash, displayName]
    );

    const userId = result.rows[0].id;
    const token = signToken(userId, email, false);

    res.status(201).json({ token, userId, displayName });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const result = await pool.query(
      'SELECT id, password_hash, display_name, is_vip FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rowCount === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken(user.id, email, user.is_vip);
    res.json({ token, userId: user.id, displayName: user.display_name, isVip: user.is_vip });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function signToken(userId: string, email: string, isVip: boolean): string {
  return jwt.sign(
    { userId, email, isVip },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
  );
}
