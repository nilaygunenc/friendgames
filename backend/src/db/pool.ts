import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Mock mode: DATABASE_URL yoksa null pool oluştur
// Controllers mock data kullanacak
const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl
  ? new Pool({
    connectionString: databaseUrl,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })
  : null as any; // Mock mode

if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected DB pool error:', err);
  });
}

// Helper: Check if using database or mock mode
export const isUsingDatabase = () => !!databaseUrl;
