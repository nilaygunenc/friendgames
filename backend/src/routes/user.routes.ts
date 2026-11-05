import { Router } from 'express';
import { getProfile, getFavorites, toggleFavorite } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/me', getProfile);
router.get('/me/favorites', getFavorites);
router.post('/me/favorites/:gameId', toggleFavorite);

export default router;
