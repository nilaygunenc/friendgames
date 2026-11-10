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
import adminRoutes from './routes/admin.routes';
import { runMigrations } from './db/migrate';
import { errorHandler } from './middleware/errorHandler';
import { pool, isUsingDatabase } from './db/pool';

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

// Serve static files (admin panel)
app.use('/admin', express.static('public'));

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
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', async (_req, res) => {
  if (!isUsingDatabase()) {
    // Mock mode
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'mock',
      mode: 'development',
      message: 'Running with mock data. Set DATABASE_URL to use real database.'
    });
    return;
  }

  try {
    // Check database connection
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbTime: dbCheck.rows[0].now
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? (err as Error).message : 'Database error'
    });
  }
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
    const usingDatabase = isUsingDatabase();

    if (usingDatabase) {
      // Run migrations on startup
      await runMigrations();
      console.log('✅ Database migrations completed');
    } else {
      console.log('⚠️  Running in MOCK MODE (no database)');
      console.log('   Using in-memory mock data for testing');
      console.log('   Set DATABASE_URL in .env to use real database');
    }

    app.listen(PORT, () => {
      console.log(`🚀 FriendGames API running on http://localhost:${PORT}`);
      console.log(`   ENV: ${process.env.NODE_ENV ?? 'development'}`);
      console.log(`   Mode: ${usingDatabase ? 'DATABASE' : 'MOCK'}`);
      if (usingDatabase) {
        console.log(`   Database: Connected`);
      }
      console.log(`   Admin Panel: http://localhost:${PORT}/admin/admin.html`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
