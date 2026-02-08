# 🧧 RedPacket 合约快速部署指南

## ✅ 已完成的工作

已为你准备好以下文件：

| 文件 | 说明 |
|------|------|
| `contracts/RedPacket.sol` | 拼手气红包智能合约 |
| `docs/SMART_CONTRACT_DEPLOY.md` | 详细部署文档（中英双语）|
| `hardhat.config.cjs` | Hardhat 配置文件 |
| `scripts/deploy.cjs` | Hardhat 部署脚本 |
| `scripts/fund.cjs` | Hardhat 充值脚本 |
| `deploy-direct.cjs` | 独立部署脚本 |

---

## 🚀 部署方式一：Remix IDE（推荐，最简单）

### 步骤：

1. **打开 Remix**
   ```
   https://remix.ethereum.org
   ```

2. **创建合约文件**
   - 点击左侧 "File Explorer" 
   - 创建新文件 `RedPacket.sol`
   - 复制 `contracts/RedPacket.sol` 的内容

3. **编译合约**
   - 点击 "Solidity Compiler" 标签
   - 选择版本 `0.8.19`
   - 点击 "Compile RedPacket.sol"

4. **连接钱包**
   - 点击 "Deploy & Run Transactions"
   - Environment 选择 `Injected Provider - MetaMask`
   - 确保钱包连接到 **Conflux eSpace Testnet** (Chain ID: 71)

5. **部署参数**
   ```
   _minAmount: 10000000000000000   (0.01 CFX)
   _maxAmount: 100000000000000000  (0.1 CFX)
   ```

6. **点击 Deploy**
   - 在钱包中确认交易
   - 保存合约地址！

7. **充值红包资金**
   - 在 Deployed Contracts 下找到你的合约
   - 在 "Value" 字段输入要充值的 CFX 数量
   - 点击 `deposit` 按钮

---

## 🔧 部署方式二：Hardhat（命令行）

### 1. 配置环境变量

```bash
# 创建 .env 文件
echo "PRIVATE_KEY=你的私钥(去掉0x前缀)" > .env
```

### 2. 获取测试币

从 Conflux 水龙头获取测试 CFX：
```
https://faucet.confluxnetwork.org/
```

### 3. 部署合约

等待编译器下载完成后：
```bash
npx hardhat run scripts/deploy.cjs --network confluxTestnet
```

### 4. 充值红包

```bash
CONTRACT_ADDRESS=0x你的合约地址 FUND_AMOUNT=5 npx hardhat run scripts/fund.cjs --network confluxTestnet
```

---

## 📋 合约功能说明

### 管理员功能 (仅合约所有者)

| 功能 | 说明 |
|------|------|
| `deposit()` | 充值 CFX 到红包合约 |
| `setAmountRange(min, max)` | 设置红包金额范围 |
| `emergencyWithdraw()` | 紧急提取所有余额 |
| `transferOwnership(newOwner)` | 转移所有权 |

### 用户功能

| 功能 | 说明 |
|------|------|
| `claim()` | 领取随机金额红包（每个地址限领一次）|

### 查询功能

| 功能 | 说明 |
|------|------|
| `getBalance()` | 合约余额 |
| `checkClaimed(address)` | 检查地址是否已领取 |
| `minAmount` / `maxAmount` | 红包金额范围 |

---

## 🔗 重要链接

| 链接 | 用途 |
|------|------|
| https://evmtestnet.confluxscan.net | Conflux 测试网浏览器 |
| https://faucet.confluxnetwork.org/ | 测试币水龙头 |
| https://remix.ethereum.org | 在线 IDE |

---

## ⚠️ 安全提示

1. **不要在主网测试** - 先在测试网充分测试
2. **保护好私钥** - 不要将私钥提交到 Git
3. **验证合约** - 部署后在 ConfluxScan 上验证合约源码

---

## 📝 部署后的操作

1. **记录合约地址**
2. **在浏览器查看**: https://evmtestnet.confluxscan.net/address/你的合约地址
3. **充值红包资金**
4. **测试 claim 功能**

---

**需要我帮你继续完成其他部分吗？**
- 前端集成代码
- 测试脚本
- 合约验证脚本
