import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/adminAuth';
import { validate } from '../middleware/validate';
import {
    adminListGames,
    adminGetGame,
    adminCreateGame,
    adminUpdateGame,
    adminDeleteGame,
    adminListQuestions,
    adminCreateQuestion,
    adminUpdateQuestion,
    adminDeleteQuestion,
    adminListTabuCards,
    adminCreateTabuCard,
    adminUpdateTabuCard,
    adminDeleteTabuCard,
    adminGetStats,
} from '../controllers/admin.controller';

const router = Router();

// Admin authentication required for all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ─── Games Management ─────────────────────────────────────────────────────
router.get('/games', adminListGames);
router.get('/games/:id', adminGetGame);

router.post(
    '/games',
    [
        body('id').trim().isLength({ min: 1 }),
        body('name').trim().isLength({ min: 1 }),
        body('icon').trim().isLength({ min: 1 }),
        body('category').isIn(['buz-kirici', 'gizli-rol', 'kelime', 'friendgames']),
        body('category_label').trim().isLength({ min: 1 }),
        body('min_players').isInt({ min: 1, max: 100 }),
        body('max_players').isInt({ min: 1, max: 100 }),
        body('min_time').isInt({ min: 1 }),
        body('max_time').isInt({ min: 1 }),
        body('description').trim().isLength({ min: 1 }),
        body('is_vip').isBoolean(),
        body('engine').trim().isLength({ min: 1 }),
        body('rules').isArray(),
        body('badges').isArray(),
    ],
    validate,
    adminCreateGame
);

router.put(
    '/games/:id',
    [
        body('name').trim().isLength({ min: 1 }),
        body('icon').trim().isLength({ min: 1 }),
        body('category').isIn(['buz-kirici', 'gizli-rol', 'kelime', 'friendgames']),
        body('category_label').trim().isLength({ min: 1 }),
        body('min_players').isInt({ min: 1, max: 100 }),
        body('max_players').isInt({ min: 1, max: 100 }),
        body('min_time').isInt({ min: 1 }),
        body('max_time').isInt({ min: 1 }),
        body('description').trim().isLength({ min: 1 }),
        body('is_vip').isBoolean(),
        body('engine').trim().isLength({ min: 1 }),
        body('rules').isArray(),
        body('badges').isArray(),
    ],
    validate,
    adminUpdateGame
);

router.delete('/games/:id', adminDeleteGame);

// ─── Questions Management ─────────────────────────────────────────────────
router.get('/questions', adminListQuestions);

router.post(
    '/questions',
    [
        body('game_pool').trim().isLength({ min: 1 }),
        body('content').trim().isLength({ min: 1 }),
        body('is_active').optional().isBoolean(),
    ],
    validate,
    adminCreateQuestion
);

router.put(
    '/questions/:id',
    [
        body('game_pool').trim().isLength({ min: 1 }),
        body('content').trim().isLength({ min: 1 }),
        body('is_active').isBoolean(),
    ],
    validate,
    adminUpdateQuestion
);

router.delete('/questions/:id', adminDeleteQuestion);

// ─── Tabu Cards Management ────────────────────────────────────────────────
router.get('/tabu-cards', adminListTabuCards);

router.post(
    '/tabu-cards',
    [
        body('main_word').trim().isLength({ min: 1 }),
        body('banned_words').isArray().isLength({ min: 1, max: 10 }),
        body('is_active').optional().isBoolean(),
    ],
    validate,
    adminCreateTabuCard
);

router.put(
    '/tabu-cards/:id',
    [
        body('main_word').trim().isLength({ min: 1 }),
        body('banned_words').isArray().isLength({ min: 1, max: 10 }),
        body('is_active').isBoolean(),
    ],
    validate,
    adminUpdateTabuCard
);

router.delete('/tabu-cards/:id', adminDeleteTabuCard);

// ─── Statistics ───────────────────────────────────────────────────────────
router.get('/stats', adminGetStats);

export default router;
