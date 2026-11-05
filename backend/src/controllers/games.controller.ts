import { Request, Response } from 'express';
import { pool } from '../db/pool';

export async function listGames(req: Request, res: Response): Promise<void> {
  const { category, group_size } = req.query as {
    category?: string;
    group_size?: string;
  };

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (category && category !== 'all') {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  if (group_size && group_size !== 'all') {
    const size = parseInt(group_size, 10);
    if (!isNaN(size)) {
      params.push(size);
      conditions.push(`min_players <= $${params.length}`);
      params.push(size);
      conditions.push(`max_players >= $${params.length}`);
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await pool.query(
      `SELECT id, name, icon, category, category_label,
              min_players, max_players, min_time, max_time,
              description, is_vip, engine, rules, badges
       FROM games ${where} ORDER BY name`,
      params
    );
    res.json({ games: result.rows });
  } catch (err) {
    console.error('listGames error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getGame(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM games WHERE id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getGame error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRandomQuestion(
  req: Request,
  res: Response
): Promise<void> {
  const { pool: gamePool } = req.params;

  try {
    const result = await pool.query(
      `SELECT content FROM questions
       WHERE game_pool = $1 AND is_active = TRUE
       ORDER BY RANDOM() LIMIT 1`,
      [gamePool]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'No questions found for this pool' });
      return;
    }
    res.json({ question: result.rows[0].content });
  } catch (err) {
    console.error('getRandomQuestion error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRandomTabuCard(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT main_word, banned_words FROM tabu_cards
       WHERE is_active = TRUE
       ORDER BY RANDOM() LIMIT 1`
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'No tabu cards found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getRandomTabuCard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
