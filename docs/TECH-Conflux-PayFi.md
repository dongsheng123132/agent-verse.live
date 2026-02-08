# 技术实现文档：Conflux 打赏与红包（CFX / Conflux eSpace）

**版本**：v1.0  
**依赖**：需求文档 `PRD-Conflux-PayFi.md`

---

## 1. 技术栈与链选型

| 层级 | 选型 | 说明 |
|------|------|------|
| 公链 | **Conflux** | 树图共识，国产公链，符合「一带一路」叙事；eSpace 与 EVM 兼容。 |
| 执行层 | **Conflux eSpace** | EVM 兼容，Solidity 合约可直接部署；使用 Conflux 的 RPC、区块浏览器。 |
| 支付资产 | **稳定币（如 USDT）或 CFX** | 打赏/红包优先使用 eSpace 上的稳定币；CFX 可用于 gas 或作为备选支付资产。 |
| 合约语言 | **Solidity** | 标准 ERC-20 接口与自定义逻辑。 |
| 前端链交互 | **Conflux 官方 JS SDK 或 ethers.js** | 连接钱包、读链状态、发交易；需兼容 Conflux eSpace 的 RPC 与地址格式。 |
| 钱包 | **Fluent 等支持 Conflux 的钱包** | 用户连接钱包、签名交易。 |

**RPC 与网络**

- 测试网：Conflux eSpace 测试网 RPC（见 Conflux 官方文档）。
- 主网：Conflux eSpace 主网 RPC；前端通过配置或环境变量切换。

---

## 2. 合约设计

### 2.1 打赏

**方案 A：简单收款地址（最小实现）**

- 使用一个 EOA 或多签地址作为「活动收款地址」。
- 前端：用户选择金额后，调用稳定币合约的 `transfer(活动收款地址, amount)` 或直接转 CFX。
- 无需自研合约；打赏记录通过链上查询该地址的入账交易获得。

**方案 B：打赏合约（推荐，便于事件与扩展）**

- 合约提供：
  - `donate(uint256 amount)` 或 `donate(uint256 amount, bytes32 eventId)`：调用前用户需先 `approve` 稳定币给该合约；合约内部 `transferFrom(msg.sender, 收款地址, amount)` 并 emit `Donate(msg.sender, amount, eventId, block.timestamp)`。
  - 收款地址可为合约 owner 或按 `eventId` 配置。
- 前端监听 `Donate` 事件或轮询合约/链上接口，展示打赏墙。

**稳定币**

- 使用 Conflux eSpace 上已部署的 USDT/USDC 等合约地址；合约内写死或通过 `setStableToken(address)` 由 owner 配置。

### 2.2 红包

**合约职责**

- 发红包：主办方将稳定币（或 CFX）转入合约，并指定 `eventId`、总份数；合约记录该 `eventId` 下的总金额、总份数、已领份数、已领用户列表（或 mapping 记录每地址是否已领）。
- 领红包：用户调用 `claim(bytes32 eventId)`；合约检查未领过、仍有剩余，按规则计算本次领取金额（均分：剩余金额/剩余份数；或随机），执行 `transfer(msg.sender, amount)`，更新已领份数与已领标记。

**接口草案（Solidity 伪代码）**

```solidity
// 红包合约核心接口（示意）
interface IRedPacket {
    function createRedPacket(bytes32 eventId, uint256 totalAmount, uint256 totalCount) external;
    function claim(bytes32 eventId) external;
    function getRedPacketInfo(bytes32 eventId) external view returns (
        uint256 totalAmount, uint256 totalCount, uint256 claimedCount, uint256 remainingAmount
    );
    function hasClaimed(bytes32 eventId, address user) external view returns (bool);
}
```

**安全与约束**

- 每地址每 `eventId` 仅可 `claim` 一次（`mapping(eventId => mapping(address => bool))`）。
- 使用 ReentrancyGuard，领款时先更新状态再转账。
- 总金额、总份数、剩余份数在合约内严格校验，防止溢出与除零。

**资产**

- 红包池使用稳定币（推荐）或 CFX；若用 CFX，合约为 `payable`，`createRedPacket` 时 `msg.value` 即总金额。

---

## 3. 前端实现要点

### 3.1 钱包连接

- 使用 Conflux 官方提供的 wallet 适配（如 Fluent 的注入对象 `window.conflux` 或 Conflux 的 `ConfluxPortal`/标准 EIP-1193）。
- 检测链 ID：确保为 Conflux eSpace 测试网/主网 chainId，错误时提示用户切换网络。
- 连接后缓存 `account` 与 `chainId`，用于展示与后续交易。

### 3.2 打赏流程

1. 用户选择金额（固定档或自定义），点击「打赏」。
2. 若未连接钱包：弹出引导连接 Conflux 钱包。
3. 若采用方案 B：先调用稳定币的 `approve(打赏合约, amount)`，再调用打赏合约的 `donate(amount)` 或 `donate(amount, eventId)`；若采用方案 A：直接调用稳定币的 `transfer(活动收款地址, amount)`。
4. 等待交易上链（轮询或订阅交易回执）；成功后在 UI 展示成功态与区块浏览器链接。
5. 打赏墙：通过合约事件或链上查询该地址/合约的入账记录，展示最近 N 条打赏。

### 3.3 红包流程

**发红包（运营/主办方）**

1. 在后台或专用页选择活动（eventId）、总金额、总份数。
2. 连接钱包后，先 `approve` 稳定币给红包合约（若用稳定币），再调用 `createRedPacket(eventId, totalAmount, totalCount)`（或合约要求的入参形式）；若用 CFX，则 `msg.value = totalAmount` 调用 payable 接口。
3. 交易确认后，该场次红包池生效；前端可展示「红包已发出，共 x 份」。

**领红包（观众）**

1. 在直播/活动页展示「领取红包」按钮；可展示当前场次剩余份数（调用合约 `getRedPacketInfo(eventId)`）。
2. 用户点击「领取红包」→ 若未连接钱包则先连接；调用 `claim(eventId)`，用户确认交易。
3. 交易成功后，合约会向用户转账；前端解析回执或事件，展示「恭喜领到 x USDT」及交易链接。
4. 若已领过或已领完，合约 revert，前端提示「您已领过」或「红包已领完」。

### 3.4 链上数据与 RPC

- 所有读操作（余额、红包信息、是否已领）通过 Conflux eSpace RPC 调用合约 view 函数。
- 写操作（打赏、approve、claim、createRedPacket）通过钱包发交易，前端获得 tx hash 后轮询 `cfx_getTransactionReceipt` 或使用 Conflux SDK 的封装。
- 区块浏览器：测试网/主网使用 Conflux 官方浏览器链接（如 `https://evm.confluxscan.io`）拼接 tx hash 或 address。

---

## 4. 配置与部署

### 4.1 合约部署

- 使用 Hardhat 或 Foundry，编译 Solidity，目标网络为 Conflux eSpace（测试网/主网）。
- 部署打赏合约（若采用方案 B）与红包合约；记录合约地址与部署区块。
- 若使用稳定币，在合约或配置中写入该链上的稳定币合约地址。

### 4.2 前端配置

- 环境变量或配置文件：Conflux eSpace RPC URL、Chain ID、打赏合约地址、红包合约地址、稳定币地址、当前活动 `eventId`（或从后端/配置拉取）。
- 区块浏览器 base URL，用于生成交易与地址链接。

### 4.3 活动与 eventId

- `eventId` 可用 bytes32 或 string 编码（如 `keccak256("gala_2026")`）；前端与合约约定一致。
- 后续扩展奥林匹克、黑客松时，新增 eventId 即可复用同一套合约与前端逻辑。

---

## 5. 测试与验收

- **单元测试**：合约层面测试打赏转入与事件、红包创建与多次 claim 边界（已领、领完、余额不足等）。
- **集成测试**：前端连接测试网钱包，完成一次打赏与一次领红包，校验链上余额与事件。
- **演示验收**：录制演示视频，展示海外视角（或模拟）连接 Conflux 钱包 → 打赏 → 领取红包，并打开区块浏览器展示交易。

---

## 6. 参考与资源

- Conflux 官网与文档：https://confluxnetwork.org
- Conflux eSpace 开发文档：eSpace 与 EVM 兼容说明、RPC、Chain ID
- Fluent 钱包：支持 Conflux 的浏览器插件
- Conflux 区块浏览器：evm.confluxscan.io（以实际为准）

---

*文档结束*
