# Rebel in Paradise（Monad Blitz Pro）报名与参赛策划

**活动官网**：[https://rebel.openbuild.xyz/](https://rebel.openbuild.xyz/)  
**性质**：AI Hackathon，Monad Blitz Pro 系列，OpenBuild × Monad 等联合主办  
**时间**：2026-01-19 ～ 2026-02-28（含 1 个月 Mentorship + 北京/深圳 Hacker Camp）  
**奖金**：总奖池约 **USD 40,000**（$20K 现金 + $20K 创意与资源奖励）

---

## 一、关键时间节点（务必遵守）

| 事项 | 截止时间 |
|------|----------|
| **报名 + 组队** | **2026-02-15 23:59 UTC+8** |
| **项目提交** | **2026-02-28 23:59 UTC+8** |
| 北京 Hacker Camp（可选） | 2026-01-31 |
| 深圳 Hacker Camp（可选） | 2026-02-07 |

- 可**全程线上**参与，不参加线下活动也可报名与提交。
- 报名后会**审核**，通过后再进行开发与提交；需在截止前完成**最终项目提交**。
- 团队**自行组队**，也可在活动社群内招募队友。

---

## 二、赛道与我们的匹配度

官网设 **3 个赛道**：

1. **Agent-native Payments**（Agent 原生支付）
2. **Intelligent Markets**（智能市场）
3. **Agent-powered Apps**（Agent 驱动应用）

**AgentVerse Live 建议主报：**

- **首选：Agent-native Payments**  
  - 现有能力：Conflux eSpace 链上**打赏**（用户向活动/节目转 CFX）、**红包**（合约发放、每人可领）、海外华人无国内支付即可参与。  
  - 叙事：活动场景下的「Agent / 用户 → 链上支付」闭环，可强调**标准化接口**（SKILL、收录入口）让 Agent 也能发起/参与支付与红包。

- **可兼提：Agent-powered Apps**  
  - 现有能力：AI 春晚、Agent 投稿节目、口令红包、春晚独立页 `/chunwan` 等，都是「由 Agent 参与、驱动」的应用场景。  
  - 若报名表允许多选或有一栏「其他相关赛道」，可勾选或简述与 Agent-powered Apps 的关联。

**关于 Monad vs Conflux：**

- 活动是 **Monad** 生态黑客松，当前项目基于 **Conflux eSpace**（EVM 兼容）。  
- **策略建议**：  
  - 在**项目描述 / Pitch** 中突出「**Agent-native 支付范式**」与「**活动场景 + 链上打赏/红包**」的可复制性。  
  - 可写一句：技术栈为 EVM 兼容链，**具备向 Monad 等高性能 EVM 链迁移的路径**（合约与前端逻辑可复用）。  
  - 若时间允许，可做一个「Monad 测试网 / 主网 PoC」或一页「Monad 扩展计划」，加分但不必须。

---

## 三、报名前准备清单

在 **2 月 15 日** 前建议完成：

- [ ] **注册账号**：在 [rebel.openbuild.xyz](https://rebel.openbuild.xyz/) 完成 Register Now，按页面要求填写。
- [ ] **确定团队**：队长 + 成员名单、角色（产品/链上/前端/运营等），如需可到活动社群招人。
- [ ] **项目一句话**：例如：「AgentVerse Live：活动场景下的 Agent 原生支付 — 打赏 + 红包，海外用户与 AI Agent 均可参与。」
- [ ] **赛道选择**：首选 **Agent-native Payments**，可辅以 Agent-powered Apps 的简短说明。
- [ ] **审核预期**：报名信息会经审核，描述尽量写清：场景、已实现功能、与赛道的契合点、技术栈（EVM/Conflux，可扩展 Monad）。

---

## 四、提交前准备（2 月 28 日前）

根据常见黑客松要求，建议提前准备好：

| 材料 | 说明 |
|------|------|
| **项目名称** | AgentVerse Live（或加副标题，如「Agent-Native Tips & Red Packets」） |
| **项目描述** | 场景（AI 春晚/活动）、痛点（跨境支付）、方案（打赏+红包+Conflux eSpace）、Agent 参与方式（投稿、领红包、SKILL） |
| **GitHub 仓库** | 开源仓库链接，README 含运行说明与合约说明 |
| **Demo 视频** | 建议 &lt;3 分钟：演示领红包、打赏、春晚页/Agent 自办节目入口 |
| **在线 Demo** | 可访问的站点（如 Vercel 部署的 agent-verse.live 或 /chunwan 页面） |
| **Pitch Deck** | 建议 ≤3 页：问题、方案、技术要点与后续规划（可复用 `docs/GWDC-Pitch-Deck-Content.md` 结构，改为主打 Agent-native Payments + Monad 扩展可能） |
| **合约与链** | 合约地址、网络（Conflux eSpace 测试网/主网）；若有 Monad 测试网版本可单独列出 |

---

## 五、叙事与 Pitch 要点（针对本赛事）

- **标题/副标题**：突出「Agent-native Payments」+「活动场景」+「跨境/海外用户」。
- **痛点**：海外华人无法用国内支付参与中国主办活动；活动方缺轻量、透明的打赏与红包方案。
- **方案**：链上打赏（用户 → 活动/节目）+ 链上红包（合约发放，每人可领）；Agent 通过 SKILL/收录入口参与投稿与互动，形成「Agent 也能用链上支付」的闭环。
- **技术**：EVM 兼容链（Conflux eSpace），合约可迁移至 Monad 等链；前端与钱包连接可复用。
- **差异化**：真实落地场景（AI 春晚）、已有合约与前端、与 GWDC/Conflux 等生态的联动，可提一句「后续可拓展至 Monad 生态」。

---

## 六、执行顺序建议

1. **本周内**：打开 [rebel.openbuild.xyz](https://rebel.openbuild.xyz/) 完成注册与报名，选定 **Agent-native Payments**，提交项目简述与团队信息。
2. **等审核通过后**：根据邮件/页面指引加入社群，确认提交格式与截止时间。
3. **2 月 15 日前**：组队与分工敲定；若想强化 Monad 叙事，可讨论是否做 Monad 测试网版或一页「Monad 扩展」。
4. **2 月 28 日前**：按上述清单准备好 Repo、Demo 视频、Pitch、在线 Demo，在截止前完成最终提交。
5. **可选**：若人在北京/深圳且时间允许，可参加 1/31 或 2/7 的 Hacker Camp，做现场交流与 Lightning Pitch。

按上述节奏推进，即可在截止前完成报名与提交；重点把「Agent-native Payments + 活动场景 + 可扩展至 Monad」讲清楚，更利于评审与资源对接。
