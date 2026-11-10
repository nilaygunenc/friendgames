-- ========================================
-- FriendGames Database Setup for Supabase
-- ========================================
-- Bu SQL'i Supabase SQL Editor'de çalıştırın
-- ========================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  vip_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Games Table
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  min_players INT NOT NULL,
  max_players INT NOT NULL,
  min_time INT NOT NULL,
  max_time INT NOT NULL,
  description TEXT NOT NULL,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  engine TEXT,
  rules JSONB NOT NULL DEFAULT '[]',
  badges JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_pool TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabu Cards Table
CREATE TABLE IF NOT EXISTS tabu_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_word TEXT NOT NULL,
  banned_words JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, game_id)
);

-- 6. VIP Purchases Table
CREATE TABLE IF NOT EXISTS vip_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  product_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revenuecat_customer TEXT
);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_is_vip ON games(is_vip);
CREATE INDEX IF NOT EXISTS idx_questions_pool ON questions(game_pool);

-- ========================================
-- Tables created successfully!
-- ========================================
