# Monad 参赛方案：CFX 替换 / 切换 / 并存

参加 Monad 黑客松时，可以三种方式处理 Conflux 与 Monad：

1. **替换**：只保留 Monad，前端和合约都只用 Monad（适合「只交 Monad 版」的提交）。
2. **切换**：前端加一个「选择链」选项，用户选 Conflux 或 Monad，用对应链的合约和 RPC。
3. **并存**：同「切换」——两条链都部署合约、前端可切换，Conflux 与 Monad 同时可用。

---

## 一、合约要不要改？

**不用改合约逻辑。**

- 现有合约（`RedPacket.sol`、`RedPacketDemo.sol`、`RedPacketWithPassphrase.sol`）是标准 Solidity、EVM 兼容，**可直接在 Monad 测试网上部署**。
- 部署时参数一致即可：如 `_minAmount`、`_maxAmount`（单位与 Conflux 一样用 wei/drip，1 CFX ≈ 1e18 drip，Monad 上 1 MON = 1e18 wei）。
- 只需在 **Monad 测试网** 上再部署一份，得到**新的合约地址**，前端按「当前选的链」用对应地址。

**小结**：合约代码不改；在 Monad 上部署同一份合约，记下 Monad 的合约地址即可。

---

## 二、前端怎么支持「链」？

当前 `SpringGala.tsx` 里是写死的：

- `RED_PACKET_CONTRACT`：一个地址  
- `CONFLUX_ESPACE_TESTNET_CHAIN_ID = 71`  
- 连接/领红包时检查 `chainId === 71`，否则提示切到 Conflux eSpace 测试网  

要做「替换 / 切换 / 并存」，都从**同一套改法**入手：把「单链常量」改成「按链配置」。

### 2.1 链配置（建议单独 config）

在项目里加一份「链配置」，例如 `config/chains.ts` 或写在 `SpringGala.tsx` 顶部：

```ts
// 链配置：Conflux 与 Monad 并存
export const CHAINS = [
  {
    chainId: 71,
    name: 'Conflux eSpace Testnet',
    nameZh: 'Conflux eSpace 测试网',
    rpcUrl: 'https://evm.confluxrpc.com',  // 测试网可用对应 RPC
    redPacketAddress: '0x8deb52e05B4664DAe9a2f382631436fa1FF501aa', // 现有
    symbol: 'CFX',
  },
  {
    chainId: 10143,
    name: 'Monad Testnet',
    nameZh: 'Monad 测试网',
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    redPacketAddress: '0x...', // 你在 Monad 上部署后的地址，先占位
    symbol: 'MON',
  },
] as const;
```

- **只做 Monad（替换）**：只保留 `chainId: 10143` 这一条，或前端默认只读这条。  
- **切换 / 并存**：两条都保留，前端加「选择链」的 UI，用当前选中链的 `chainId`、`redPacketAddress`、`symbol`。

### 2.2 前端需要改的地方（SpringGala.tsx）

| 位置 | 现在 | 改法 |
|------|------|------|
| 合约地址 | 写死 `RED_PACKET_CONTRACT` | 用「当前链」的 `redPacketAddress`（来自上面 config） |
| 链 ID | 写死 `CONFLUX_ESPACE_TESTNET_CHAIN_ID = 71` | 用「当前链」的 `chainId`；连接/领红包时检查 `chainId === 当前链`，否则 `wallet_switchEthereumChain` 到当前链 |
| 币种展示 | 文案里写死 CFX | 用「当前链」的 `symbol`（CFX / MON） |
| 领红包 / 读余额 / deposit | 都用同一个地址 | 全部改为「当前链」对应的 `redPacketAddress` |

再加一点状态与 UI：

- **状态**：`selectedChainId`（或 `selectedChain`），默认 71 或 10143 由你定（只做 Monad 就默认 10143）。
- **UI**：在红包/资金看板附近加一个**链选择器**（下拉或两个 Tab）：  
  - 「Conflux eSpace」 / 「Monad 测试网」  
  - 选哪个就把 `selectedChainId` 设为该链的 `chainId`，后续所有读合约、发交易都用这条链的配置。

这样：

- **替换**：只配 Monad 一条链，或不展示选择器、写死 Monad。  
- **切换 / 并存**：两条链都配，用户在前端选链即可。

---

## 三、Monad 测试网信息（部署与钱包）

- **Chain ID**：10143（hex: `0x279f`）  
- **RPC**：https://testnet-rpc.monad.xyz  
- **原生代币**：MON  
- **区块浏览器**：https://testnet.monadexplorer.com  
- **水龙头**：可通过 Alchemy 等获取测试币  

部署步骤与 Conflux 类似：用 Hardhat/Remix 连 Monad 测试网，部署现有红包合约，把得到的地址填进上面配置里的 `redPacketAddress`（Monad 那一项）。

---

## 四、实施顺序建议

1. **在 Monad 测试网部署合约**  
   用现有 `RedPacketDemo.sol` 或 `RedPacketWithPassphrase.sol`，部署后得到 Monad 上的合约地址。

2. **加链配置**  
   新建 `config/chains.ts`（或等价位置），把 Conflux 和 Monad 两条链的 `chainId`、`rpcUrl`、`redPacketAddress`、`symbol` 写进去。

3. **前端：链选择 + 用配置替代常量**  
   在 SpringGala 里：  
   - 引入链配置；  
   - 增加 `selectedChainId`（及可选 `setSelectedChainId`）；  
   - 所有用 `RED_PACKET_CONTRACT`、`CONFLUX_ESPACE_TESTNET_CHAIN_ID`、以及展示「CFX」的地方，改为从链配置里按 `selectedChainId` 取 `redPacketAddress`、`chainId`、`symbol`；  
   - 连接钱包 / 领红包时：若当前钱包的 `chainId` 不等于 `selectedChainId`，则 `wallet_switchEthereumChain` 到 `selectedChainId`（Monad 为 `0x279f`）。

4. **UI 链选择器**  
   在红包资金看板（你截图里「当前奖池余额 / 已发出红包 / 累计打赏」那一块）上方或左侧加「Conflux eSpace | Monad 测试网」切换；切换后刷新余额、领红包、发红包都走新选的链。

5. **（可选）持久化选择**  
   用 `localStorage` 存 `selectedChainId`，下次进入页面默认选上次的链。

---

## 五、小结

| 问题 | 答案 |
|------|------|
| 合约要改吗？ | **不用**。同一份 Solidity 在 Monad 上再部署一次即可。 |
| 替换 CFX？ | 只配 Monad、或前端默认 Monad，即相当于「替换」。 |
| 切换 / 并存？ | 配两条链 + 前端「选择链」UI，用户选哪条用哪条。 |
| 前端改什么？ | 链配置 + 用「当前链」的 chainId / 合约地址 / symbol 替代写死的常量和文案。 |

按上面做，就可以在「只交 Monad 版」和「Conflux / Monad 双链并存」之间自由选一种交给 Monad 比赛用。
