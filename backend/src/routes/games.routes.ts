import { Router } from 'express';
import {
  listGames,
  getGame,
  getRandomQuestion,
  getRandomTabuCard,
} from '../controllers/games.controller';

const router = Router();

// Public endpoints
router.get('/', listGames);
router.get('/tabu/card', getRandomTabuCard);
router.get('/questions/:pool', getRandomQuestion);
router.get('/:id', getGame);

export default router;
