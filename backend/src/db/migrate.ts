import { pool, isUsingDatabase } from './pool';

const migrations = [
  /* 001 — users */
  `CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name  TEXT NOT NULL,
    is_vip        BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
    vip_expires_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  /* 002 — games */
  `CREATE TABLE IF NOT EXISTS games (
    id             TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    icon           TEXT NOT NULL,
    category       TEXT NOT NULL,
    category_label TEXT NOT NULL,
    min_players    INT NOT NULL,
    max_players    INT NOT NULL,
    min_time       INT NOT NULL,
    max_time       INT NOT NULL,
    description    TEXT NOT NULL,
    is_vip         BOOLEAN NOT NULL DEFAULT FALSE,
    engine         TEXT NOT NULL,
    rules          JSONB NOT NULL DEFAULT '[]',
    badges         JSONB NOT NULL DEFAULT '[]',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  /* 003 — questions */
  `CREATE TABLE IF NOT EXISTS questions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_pool  TEXT NOT NULL,
    content    TEXT NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  /* 004 — tabu_cards */
  `CREATE TABLE IF NOT EXISTS tabu_cards (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_word    TEXT NOT NULL,
    banned_words JSONB NOT NULL DEFAULT '[]',
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  /* 005 — user_favorites */
  `CREATE TABLE IF NOT EXISTS user_favorites (
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    game_id    TEXT REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, game_id)
  )`,

  /* 006 — vip_purchases */
  `CREATE TABLE IF NOT EXISTS vip_purchases (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
    platform            TEXT NOT NULL,
    transaction_id      TEXT UNIQUE NOT NULL,
    product_id          TEXT NOT NULL,
    purchased_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ,
    revenuecat_customer TEXT
  )`,

  /* 007 — indexes */
  `CREATE INDEX IF NOT EXISTS idx_games_category ON games(category)`,
  `CREATE INDEX IF NOT EXISTS idx_games_is_vip ON games(is_vip)`,
  `CREATE INDEX IF NOT EXISTS idx_questions_pool ON questions(game_pool)`,
];

export async function runMigrations() {
  if (!isUsingDatabase()) {
    console.log('⚠️  Skipping migrations (mock mode)');
    return;
  }

  const client = await pool.connect();
  try {
    for (const sql of migrations) {
      await client.query(sql);
    }
    console.log('✅ Migrations completed');
  } finally {
    client.release();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  if (!isUsingDatabase()) {
    console.log('❌ DATABASE_URL not set. Please configure database first.');
    process.exit(1);
  }

  runMigrations()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
