import { Request, Response } from 'express';
import { pool } from '../db/pool';

// ─── Admin: List All Games ────────────────────────────────────────────────
export async function adminListGames(req: Request, res: Response): Promise<void> {
    try {
        const result = await pool.query(
            `SELECT * FROM games ORDER BY created_at DESC`
        );
        res.json({ games: result.rows });
    } catch (err) {
        console.error('adminListGames error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Get Single Game ───────────────────────────────────────────────
export async function adminGetGame(req: Request, res: Response): Promise<void> {
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
        console.error('adminGetGame error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Create Game ───────────────────────────────────────────────────
export async function adminCreateGame(req: Request, res: Response): Promise<void> {
    const {
        id, name, icon, category, category_label,
        min_players, max_players, min_time, max_time,
        description, is_vip, engine, rules, badges
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO games
         (id, name, icon, category, category_label, min_players, max_players,
          min_time, max_time, description, is_vip, engine, rules, badges)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
            [id, name, icon, category, category_label,
                min_players, max_players, min_time, max_time,
                description, is_vip, engine,
                JSON.stringify(rules), JSON.stringify(badges)]
        );

        res.status(201).json({ game: result.rows[0] });
    } catch (err: any) {
        console.error('adminCreateGame error:', err);
        if (err.code === '23505') { // unique violation
            res.status(409).json({ error: 'Game ID already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

// ─── Admin: Update Game ───────────────────────────────────────────────────
export async function adminUpdateGame(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
        name, icon, category, category_label,
        min_players, max_players, min_time, max_time,
        description, is_vip, engine, rules, badges
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE games
       SET name = $1, icon = $2, category = $3, category_label = $4,
           min_players = $5, max_players = $6, min_time = $7, max_time = $8,
           description = $9, is_vip = $10, engine = $11, rules = $12, badges = $13
       WHERE id = $14
       RETURNING *`,
            [name, icon, category, category_label,
                min_players, max_players, min_time, max_time,
                description, is_vip, engine,
                JSON.stringify(rules), JSON.stringify(badges), id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }

        res.json({ game: result.rows[0] });
    } catch (err) {
        console.error('adminUpdateGame error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Delete Game ───────────────────────────────────────────────────
export async function adminDeleteGame(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM games WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }

        res.json({ message: 'Game deleted successfully', id });
    } catch (err) {
        console.error('adminDeleteGame error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: List Questions ────────────────────────────────────────────────
export async function adminListQuestions(req: Request, res: Response): Promise<void> {
    try {
        const result = await pool.query(
            `SELECT * FROM questions ORDER BY created_at DESC`
        );
        res.json({ questions: result.rows });
    } catch (err) {
        console.error('adminListQuestions error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Create Question ───────────────────────────────────────────────
export async function adminCreateQuestion(req: Request, res: Response): Promise<void> {
    const { game_pool, content, is_active } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO questions (game_pool, content, is_active)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [game_pool, content, is_active ?? true]
        );

        res.status(201).json({ question: result.rows[0] });
    } catch (err) {
        console.error('adminCreateQuestion error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Update Question ───────────────────────────────────────────────
export async function adminUpdateQuestion(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { game_pool, content, is_active } = req.body;

    try {
        const result = await pool.query(
            `UPDATE questions
       SET game_pool = $1, content = $2, is_active = $3
       WHERE id = $4
       RETURNING *`,
            [game_pool, content, is_active, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Question not found' });
            return;
        }

        res.json({ question: result.rows[0] });
    } catch (err) {
        console.error('adminUpdateQuestion error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Delete Question ───────────────────────────────────────────────
export async function adminDeleteQuestion(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM questions WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Question not found' });
            return;
        }

        res.json({ message: 'Question deleted successfully', id });
    } catch (err) {
        console.error('adminDeleteQuestion error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: List Tabu Cards ───────────────────────────────────────────────
export async function adminListTabuCards(req: Request, res: Response): Promise<void> {
    try {
        const result = await pool.query(
            `SELECT * FROM tabu_cards ORDER BY created_at DESC`
        );
        res.json({ tabu_cards: result.rows });
    } catch (err) {
        console.error('adminListTabuCards error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Create Tabu Card ──────────────────────────────────────────────
export async function adminCreateTabuCard(req: Request, res: Response): Promise<void> {
    const { main_word, banned_words, is_active } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tabu_cards (main_word, banned_words, is_active)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [main_word, JSON.stringify(banned_words), is_active ?? true]
        );

        res.status(201).json({ tabu_card: result.rows[0] });
    } catch (err) {
        console.error('adminCreateTabuCard error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Update Tabu Card ──────────────────────────────────────────────
export async function adminUpdateTabuCard(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { main_word, banned_words, is_active } = req.body;

    try {
        const result = await pool.query(
            `UPDATE tabu_cards
       SET main_word = $1, banned_words = $2, is_active = $3
       WHERE id = $4
       RETURNING *`,
            [main_word, JSON.stringify(banned_words), is_active, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Tabu card not found' });
            return;
        }

        res.json({ tabu_card: result.rows[0] });
    } catch (err) {
        console.error('adminUpdateTabuCard error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Delete Tabu Card ──────────────────────────────────────────────
export async function adminDeleteTabuCard(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM tabu_cards WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Tabu card not found' });
            return;
        }

        res.json({ message: 'Tabu card deleted successfully', id });
    } catch (err) {
        console.error('adminDeleteTabuCard error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Admin: Statistics ────────────────────────────────────────────────────
export async function adminGetStats(req: Request, res: Response): Promise<void> {
    try {
        const [gamesCount, usersCount, questionsCount, tabuCount] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM games'),
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query('SELECT COUNT(*) FROM questions'),
            pool.query('SELECT COUNT(*) FROM tabu_cards'),
        ]);

        res.json({
            stats: {
                total_games: parseInt(gamesCount.rows[0].count),
                total_users: parseInt(usersCount.rows[0].count),
                total_questions: parseInt(questionsCount.rows[0].count),
                total_tabu_cards: parseInt(tabuCount.rows[0].count),
            }
        });
    } catch (err) {
        console.error('adminGetStats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
