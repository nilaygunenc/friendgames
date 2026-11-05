import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import gamesRoutes from './routes/games.routes';
import userRoutes from './routes/user.routes';
import vipRoutes from './routes/vip.routes';
import { runMigrations } from './db/migrate';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);

// ─── Security & Middleware ─────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://friendgames.app']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50kb' }));

// Rate limiting — general
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: { error: 'Too many requests, please try again later.' },
  })
);

// Rate limiting — auth routes (tighter)
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many auth attempts, please try again later.' },
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vip',   vipRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (MUST be last)
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────
async function start() {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`🚀 FriendGames API running on http://localhost:${PORT}`);
      console.log(`   ENV: ${process.env.NODE_ENV ?? 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
