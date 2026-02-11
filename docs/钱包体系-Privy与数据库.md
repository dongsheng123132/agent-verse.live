# 钱包体系：连接自己的钱包 + 我们服务器记积分（推荐）

## 推荐方案（不收费）

- **用户自己绑定钱包地址**：MetaMask、Fluent 等 EVM 钱包连接后，用 **签名登录**（personal_sign），后端验证签名后以钱包地址为 `user_id`，积分、邀请、预测、福气地图全部记录在我们自己的服务器。
- **不依赖 Privy**：无需 Privy 付费能力；Privy 为可选（若配置了可同时提供社交登录）。

## 可选：Privy（收费）

- 社交登录（Twitter / Google）+ Embedded Wallet 由 Privy 托管，适合需要「无钱包用户也能玩」的场景。
- 配置 `VITE_PRIVY_APP_ID` 与后端 `PRIVY_APP_*` 后，积分中心会多出「Twitter / Google 登录」入口。

## 功能

- 社交登录（Privy 提供 UI）
- 自动创建 Embedded Wallet（EVM）
- 支持测试网
- 后端校验 Privy 身份并同步到 DB

## 数据库表（Supabase）

表名：`users`

| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | text PRIMARY KEY | 主键，可用 wallet_address 或 Privy DID |
| twitter_id | text | Twitter 账号（来自 Privy linked accounts） |
| wallet_address | text NOT NULL | EVM 地址（小写） |
| invite_code | text NOT NULL UNIQUE | 邀请码 |
| points | integer DEFAULT 100 | 积分，注册送 100 |
| five_fu_status | text | 福气/五福状态，可选 |
| country | text | 国家代码 |
| city | text | 城市 |
| created_at | timestamptz DEFAULT now() | 创建时间 |
| updated_at | timestamptz DEFAULT now() | 更新时间 |

### SQL（Supabase）

```sql
-- 在 Supabase SQL Editor 中执行
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
```

## 环境变量

### 前端（Vite）

- `VITE_PRIVY_APP_ID`：Privy Dashboard 中的 App ID

### 后端

- `PRIVY_APP_ID`：同上
- `PRIVY_APP_SECRET`：Privy Dashboard 中的 App Secret（仅服务端，勿暴露）
- `SUPABASE_URL`：Supabase 项目 URL
- `SUPABASE_SERVICE_ROLE_KEY`：Supabase Service Role Key（服务端读写，勿暴露）

未配置 Supabase 时，后端可回退到内存存储（仅开发）。

## 当前实现（MVP）

- **后端**
  - **`POST /api/v1/auth/wallet`**（推荐）：body `wallet_address`, `message`, `signature`。后端用 ethers 校验 `personal_sign` 签名，通过后以钱包地址为 `user_id` 创建/返回用户（送 100 积分），积分存我们服务器。
  - **`POST /api/v1/auth/privy`**（可选）：Privy 社交登录同步，同上以 wallet 为 user_id；需配置 Privy 且为收费服务。
- **前端**：积分中心顶栏**主入口为「连接钱包（MetaMask）」**，连接后签名并调 `/auth/wallet`，用返回的 `user_id`（即钱包地址）作为 Bearer 参与积分/预测/福气地图。若配置了 `VITE_PRIVY_APP_ID` 会多出「Twitter / Google 登录」。

## 流程

1. 用户在前端点击「Twitter / Google 登录」→ Privy 弹窗
2. 登录成功后，Privy 自动创建或关联 Embedded Wallet
3. 前端取 identity token 或 access token，请求 `POST /api/v1/auth/privy`，body: `{ id_token }`
4. 后端用 Privy Server SDK 校验 token，获取 wallet、twitter，upsert 到用户存储（当前为内存；可接 Supabase），返回 user（user_id = wallet_address, invite_code, points, ...）
5. 前端将返回的 `user_id` 存为 `points_user_id`，后续请求带 Bearer，用于积分、预测、福气地图等

## 参考

- [Privy React Setup](https://docs.privy.io/basics/react/setup)
- [Privy Node SDK](https://docs.privy.io/basics/nodeJS/quickstart)
- [Access Tokens](https://docs.privy.io/authentication/user-authentication/access-tokens)
