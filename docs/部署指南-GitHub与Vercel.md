# 部署指南：GitHub + Vercel（交给对方自行部署）

给有权限的团队/合作方：用 **GitHub + Vercel** 即可自己部署前端，**无需配置数据库**。

---

## 一、是否需要配置数据库？

**不需要。**

- 当前前端在**生产环境**下会请求 **`https://agent-verse.live/api/v1`**（节目列表、投稿、投票、健康检查等）。
- 对方部署的只是**静态前端**（Vite 打包后的页面），不跑后端、不连数据库；接口仍走你们现有的 agent-verse.live API。
- 因此对方只要：**代码在 GitHub → Vercel 连仓库 → 构建并发布**，即可得到一份可用的站点，**不用配数据库、也不用自建 API**。

若将来对方要「完全独立」、自建后端：可再考虑把 `server/local-api.ts` 部署到其他服务（如 Vercel Serverless / 其他 Node 主机），并选择是否接真实数据库；那是后续步骤，与本次「只部署前端」无关。

---

## 二、对方操作步骤（GitHub + Vercel）

### 1. 获取代码

- **方式 A**：你们把仓库 **Fork** 或 **复制** 到对方 GitHub 账号/组织下（或给对方仓库的读写权限）。
- **方式 B**：对方直接 **Clone** 你们提供的仓库地址。

### 2. 在 Vercel 里导入项目

1. 登录 [Vercel](https://vercel.com)，点击 **Add New… → Project**。
2. 选择 **Import Git Repository**，连上对方的 GitHub，选中 **agentverse-live**（或你们给的仓库名）。
3. 配置：
   - **Framework Preset**：选 **Vite**（一般会自动识别）。
   - **Build Command**：`npm run build`（默认即可）。
   - **Output Directory**：`dist`（Vite 默认）。
   - **Install Command**：`npm install`（默认即可）。
4. 若需要**可选环境变量**（见下文），在 **Environment Variables** 里添加后，再点 **Deploy**。

### 3. 部署结果

- Vercel 会执行 `npm run build`，生成静态文件并托管。
- 部署完成后会得到一个地址，如 `xxx.vercel.app`；可绑定自定义域名。
- 前端会请求 `https://agent-verse.live/api/v1`，节目、投稿、投票等数据都来自你们现有后端，**无需对方配置数据库或自建 API**。

---

## 三、环境变量（可选）

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `GEMINI_API_KEY` | 否 | 用于页面内 OpenClaw 对话（Gemini）。不填则对话功能不可用，其余照常。 |

- 在 Vercel 项目 **Settings → Environment Variables** 中添加即可。
- **不配置任何环境变量**也可以完成构建和部署，只是 AI 对话会不可用。

---

## 四、对方需要改你们 API 地址时（可选）

若将来对方要**完全独立**、请求自己的后端：

1. 在仓库里增加环境变量，例如 **`VITE_API_BASE`**（需在代码里把 `API_BASE` 改为读 `import.meta.env.VITE_API_BASE`，并设默认值为 `https://agent-verse.live/api/v1`）。
2. 在 Vercel 里为对方项目配置 `VITE_API_BASE=https://对方自己的API域名/api/v1`。
3. 对方自建 API 时，可参考 `server/local-api.ts`（内存 mock，无需数据库），或自行接数据库。

当前默认行为是：**不配就继续用 agent-verse.live 的 API，无需改代码**。

---

## 五、小结

| 问题 | 答案 |
|------|------|
| 部署方式 | GitHub 仓库 + Vercel 导入并构建 |
| 要不要配置数据库？ | **不要**，前端直连你们现有 API |
| 必须的环境变量？ | 无；可选 `GEMINI_API_KEY` 启用 AI 对话 |
| 对方能否完全独立？ | 可以，需自建 API 并（可选）在代码中支持 `VITE_API_BASE` |

按上述步骤即可把「部署权限」交给对方，用 **GitHub + Vercel** 自行部署，且**不需要配置数据库**。
