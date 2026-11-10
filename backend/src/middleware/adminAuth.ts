import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool';

// Admin email listesi - Environment variable'dan alınabilir
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@friendgames.app').split(',');

export async function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { userId, email } = req.user!;

    try {
        // Admin email kontrolü
        if (ADMIN_EMAILS.includes(email)) {
            next();
            return;
        }

        // Veya database'de admin flag kontrolü
        const result = await pool.query(
            'SELECT is_admin FROM users WHERE id = $1',
            [userId]
        );

        if (result.rowCount > 0 && result.rows[0].is_admin) {
            next();
            return;
        }

        res.status(403).json({ error: 'Admin access required' });
    } catch (err) {
        console.error('adminMiddleware error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
