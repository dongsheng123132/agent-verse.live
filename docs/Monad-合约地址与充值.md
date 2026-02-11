# Monad 红包合约地址与充值

## CFX 和 MON 的合约地址为什么一样？

当前界面上：

- **CFX 合约地址**（Conflux eSpace 测试网）：`0x8deb52e05B4664DAe9a2f382631436fa1FF501aa`
- **MON 合约地址**（Monad 测试网）：`0x8deb52e05B4664DAe9a2f382631436fa1FF501aa`

**可以一样。** 这是两条不同的链，同一个「地址字面量」代表的是**两条链上各自部署的两份合约**，不是同一个合约。  
- 转 **CFX** 时，钱包在 **Conflux 链**上把 CFX 打到该地址（Conflux 上的那份合约）。  
- 转 **MON** 时，钱包在 **Monad 链**上把 MON 打到该地址（Monad 上的那份合约）。

若你在 Monad 上部署得到的是**另一个地址**（例如 `0x790C...`），请把 `components/SpringGala.tsx` 里的 **`RED_PACKET_MONAD_CONTRACT`** 改成你实际部署的地址；前端没有替你部署，地址是你部署后提供并写进前端的。

---

## 前端当前使用的合约地址

**RedPacketDemoMonad（升级版，支持直接转账充值）**

```
0x8deb52e05B4664DAe9a2f382631436fa1FF501aa
```

- **网络**：Monad Testnet（Chain ID 10143）  
- **RPC**：https://testnet-rpc.monad.xyz  
- **区块浏览器**：https://testnet.monadexplorer.com  

在浏览器查看该地址余额与交易：  
https://testnet.monadexplorer.com/address/0x8deb52e05B4664DAe9a2f382631436fa1FF501aa  

---

## 是否已部署？

- 前端使用的合约地址为 **0x8deb52e05B4664DAe9a2f382631436fa1FF501aa**（升级后重部署）。  
- 在 [Monad 测试网浏览器](https://testnet.monadexplorer.com/address/0x8deb52e05B4664DAe9a2f382631436fa1FF501aa) 可查看合约、余额和交易。

---

## 如何充值（转入 MON）

合约有 `receive()`，**直接向合约地址转 MON 即可**，无需调 `deposit()`。

1. 用支持 Monad Testnet 的钱包（如 MetaMask 添加 Monad Testnet）。  
2. 向下面地址**转 MON**（测试网水龙头领的或已有的 MON）：  
   **`0x8deb52e05B4664DAe9a2f382631436fa1FF501aa`**  
3. 转成功后，前端「当前余额」「总收到」会从链上读到并更新（约 5 秒轮询一次）。

也可以不直接转账，而用 Remix/脚本对该合约调用 **`deposit()`** 并附带 MON，效果相同。

---

## 若尚未部署或要重新部署

合约在 **`contracts/monad/`** 下：

- `RedPacketMonad.sol`：每人限领一次  
- `RedPacketDemoMonad.sol`：演示版，无限领取、随机金额（前端按此合约 ABI 读数据）

部署（需配置好 Monad 测试网私钥）：

```bash
npx hardhat run scripts/deploy_monad.cjs --network monadTestnet
```

脚本会先部署 RedPacketMonad，再部署 **RedPacketDemoMonad**，并在控制台打印两个地址。前端应使用 **RedPacketDemoMonad** 的地址（第二个）。

### 部署后更新前端

把 `components/SpringGala.tsx` 里的 `RED_PACKET_MONAD_CONTRACT` 改成你本次部署得到的 **RedPacketDemoMonad** 地址（当前为 `0x8deb52e05B4664DAe9a2f382631436fa1FF501aa`）。

---

## 小结

| 项目 | 内容 |
|------|------|
| **当前合约地址** | `0x8deb52e05B4664DAe9a2f382631436fa1FF501aa` |
| **充值方式** | 钱包直接向该地址转 MON（合约支持直接转账充值） |
| **链上核对** | https://testnet.monadexplorer.com/address/0x8deb52e05B4664DAe9a2f382631436fa1FF501aa |
| **合约代码** | `contracts/monad/RedPacketDemoMonad.sol` |
| **部署脚本** | `scripts/deploy_monad.cjs`，网络 `monadTestnet` |

你若刚才转的是这个地址且网络选的是 **Monad Testnet**，转成功后刷新页面或等几秒，前端应会显示余额。

**若打入过钱但页面仍显示 0，请逐项核对：**

1. **地址是否弄错**  
   - **红包合约地址（充值请转这个）**：`0x8deb52e05B4664DAe9a2f382631436fa1FF501aa`  
   - **收款钱包地址（不要转这个）**：`0x408E2fC4FCAF2D38a6C9dcF07C6457bdFb6e0250`  
   充值必须转至**合约地址**，转至收款钱包不会进奖池。

2. **网络是否正确**  
   须为 **Monad Testnet**（Chain ID 10143），不是主网或其它链。

3. **链上确认**  
   在 [区块浏览器](https://testnet.monadexplorer.com/address/0x8deb52e05B4664DAe9a2f382631436fa1FF501aa) 打开该合约地址，查看 Balance 和交易记录；若浏览器里余额也为 0，说明款未打到该地址或该网络。
