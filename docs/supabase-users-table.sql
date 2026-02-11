-- 钱包体系用户表（在 Supabase SQL Editor 中执行）
-- 见 docs/钱包体系-Privy与数据库.md

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  twitter_id TEXT,
  wallet_address TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  points INTEGER NOT NULL DEFAULT 100,
  five_fu_status TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_users_twitter ON users(twitter_id);

COMMENT ON TABLE users IS 'Privy 社交登录 + Embedded Wallet 用户，与积分/预测/福气地图关联';
