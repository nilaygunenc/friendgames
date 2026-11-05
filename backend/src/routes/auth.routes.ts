import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('displayName').trim().isLength({ min: 2, max: 50 }),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  login
);

export default router;
