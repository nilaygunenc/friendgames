import { Router } from 'express';
import { authMiddleware, vipMiddleware } from '../middleware/auth';
import { createTabuDeck, generateTabuDeck, getTabuDeckByCode, listTabuDecks } from '../controllers/tabuDecks.controller';

const router = Router();
router.use(authMiddleware, vipMiddleware);
router.get('/', listTabuDecks);
router.post('/', createTabuDeck);
router.post('/generate', generateTabuDeck);
router.get('/:code', getTabuDeckByCode);

export default router;
