# RedPacket Smart Contract Deployment Guide
# 红包智能合约部署指南

## Overview / 概述

This guide will walk you through deploying the RedPacket smart contract on **Conflux eSpace** using Remix IDE.

本指南将教你如何使用 Remix IDE 在 **Conflux eSpace** 上部署红包智能合约。

---

## Prerequisites / 准备工作

1. **Fluent Wallet** or **MetaMask** installed / 安装 Fluent 钱包或 MetaMask
2. **CFX tokens** for gas fees / 用于支付 gas 费的 CFX 代币
3. **Remix IDE** (https://remix.ethereum.org) / 访问 Remix IDE

---

## Step 1: Add Conflux eSpace Network / 添加 Conflux eSpace 网络

### Network Configuration / 网络配置:

| Field | Value |
|-------|-------|
| **Network Name** | Conflux eSpace |
| **RPC URL** | https://evm.confluxrpc.com |
| **Chain ID** | 1030 |
| **Currency Symbol** | CFX |
| **Block Explorer** | https://evm.confluxscan.net |

---

## Step 2: Open Remix IDE / 打开 Remix IDE

1. Go to https://remix.ethereum.org
2. Create a new file: `RedPacket.sol`
3. Copy and paste the contract code from `contracts/RedPacket.sol`

---

## Step 3: Compile the Contract / 编译合约

1. Click **Solidity Compiler** tab (左侧第二个图标)
2. Select compiler version: `0.8.19` or compatible
3. Click **Compile RedPacket.sol**
4. ✅ Wait for green checkmark

---

## Step 4: Deploy / 部署

1. Click **Deploy & Run Transactions** tab (左侧第三个图标)
2. **Environment**: Select `Injected Provider - MetaMask` (or Fluent)
3. Make sure your wallet is connected to Conflux eSpace
4. **Contract**: Select `RedPacket`
5. **Constructor Parameters**:
   - `_minAmount`: Minimum claim amount (e.g., `10000000000000000` = 0.01 CFX)
   - `_maxAmount`: Maximum claim amount (e.g., `100000000000000000` = 0.1 CFX)

### Example Parameters / 示例参数:
```
_minAmount: 10000000000000000    (0.01 CFX)
_maxAmount: 100000000000000000   (0.1 CFX)
```

6. **重要**：在 Remix 里 Deploy 按钮旁会出现两个输入框 `_minAmount` 和 `_maxAmount`，**必须都填数字**，不能留空，否则会报错：`Error encoding arguments: invalid BigNumberish string: empty string`。直接复制上面的示例数字即可。
7. **Value 填 0**：部署时顶部的 **VALUE** 请设为 `0`（单位 Wei）。若部署时附带 CFX 会触发合约的 `receive()`，在 Conflux eSpace 上可能导致 gas 估算失败或 `execution reverted`。部署成功后再用下面的 Step 5 给合约充值。
8. Click **Deploy**
9. Confirm transaction in your wallet
10. Copy the deployed contract address!

---

## Step 5: Deposit CFX / 充值 CFX

After deployment, you need to fund the contract:

### Method 1: Using Remix / 方法1：使用 Remix
1. Find your deployed contract in the "Deployed Contracts" section
2. Find the `deposit` function
3. Enter the amount of CFX to deposit in the "Value" field (above the functions)
4. Click **deposit** button
5. Confirm the transaction

### Method 2: Direct Transfer / 方法2：直接转账
Simply send CFX directly to the contract address.

---

## Contract Functions / 合约函数说明

### Owner Functions (管理员函数)

| Function | Description |
|----------|-------------|
| `deposit()` | 充值 CFX 到红包合约 |
| `setAmountRange(min, max)` | 设置红包金额范围 |
| `emergencyWithdraw()` | 紧急提取所有余额 |
| `transferOwnership(newOwner)` | 转移所有权 |

### User Functions (用户函数)

| Function | Description |
|----------|-------------|
| `claim()` | 领取随机金额红包 |

### View Functions (查询函数)

| Function | Description |
|----------|-------------|
| `getBalance()` | 获取合约余额 |
| `checkClaimed(address)` | 检查地址是否已领取 |
| `hasClaimed(address)` | 检查地址是否已领取 |
| `getRemainingPackets()` | 获取剩余可领取红包数量 |
| `minAmount` | 最小红包金额 |
| `maxAmount` | 最大红包金额 |
| `owner` | 合约所有者地址 |

---

## Events / 事件

| Event | Description |
|-------|-------------|
| `Deposit` | 充值事件 |
| `Claim` | 领取红包事件 |
| `ConfigUpdated` | 配置更新事件 |
| `EmergencyWithdraw` | 紧急提款事件 |

---

## Security Notes / 安全注意事项

1. ✅ Only the owner can deposit and configure
2. ✅ Each address can only claim once
3. ✅ Random amounts between min and max
4. ✅ Emergency withdraw function for owner
5. ⚠️ The randomness is based on block hash (sufficient for this use case)

---

## Example Workflow / 示例流程

```
1. Deploy contract with min=0.01 CFX, max=0.1 CFX
2. Deposit 10 CFX to the contract
3. Users call claim() to receive random amounts (0.01-0.1 CFX)
4. Monitor events to track claims
5. Use emergencyWithdraw() if needed
```

---

## Troubleshooting / 故障排除

| Issue | Solution |
|-------|----------|
| "Insufficient balance" | 合约余额不足，需要充值 |
| "Already claimed" | 该地址已经领取过 |
| "Only owner" | 只有合约所有者可以调用 |
| Gas estimation failed | 检查网络连接和余额 |

---

## Contract Address on Testnet / 测试网合约地址

After deployment, update this section with your contract address:

```
Testnet: [Your Contract Address]
Mainnet: [Your Contract Address]
```

---

## Support / 支持

For issues or questions:
- Conflux Docs: https://doc.confluxnetwork.org
- Conflux Discord: https://discord.gg/conflux

---

**Happy Deploying! / 部署愉快！** 🧧
