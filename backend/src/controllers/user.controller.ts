import { Request, Response } from 'express';
import { pool } from '../db/pool';

export async function getProfile(req: Request, res: Response): Promise<void> {
  const { userId } = req.user!;

  try {
    const result = await pool.query(
      `SELECT id, email, display_name, is_vip, vip_expires_at, created_at
       FROM users WHERE id = $1`,
      [userId]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getFavorites(req: Request, res: Response): Promise<void> {
  const { userId } = req.user!;

  try {
    const result = await pool.query(
      `SELECT g.id, g.name, g.icon, g.category, g.min_players, g.max_players,
              g.min_time, g.max_time
       FROM user_favorites uf
       JOIN games g ON g.id = uf.game_id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );
    res.json({ favorites: result.rows });
  } catch (err) {
    console.error('getFavorites error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function toggleFavorite(req: Request, res: Response): Promise<void> {
  const { userId } = req.user!;
  const { gameId } = req.params;

  try {
    const existing = await pool.query(
      'SELECT 1 FROM user_favorites WHERE user_id = $1 AND game_id = $2',
      [userId, gameId]
    );

    if ((existing.rowCount ?? 0) > 0) {
      await pool.query(
        'DELETE FROM user_favorites WHERE user_id = $1 AND game_id = $2',
        [userId, gameId]
      );
      res.json({ favorited: false });
    } else {
      await pool.query(
        'INSERT INTO user_favorites (user_id, game_id) VALUES ($1, $2)',
        [userId, gameId]
      );
      res.json({ favorited: true });
    }
  } catch (err) {
    console.error('toggleFavorite error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
