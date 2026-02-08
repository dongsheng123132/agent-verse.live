# AgentVerse Live - Spring Gala Edition

A decentralized Spring Festival Gala experience featuring 3D visualization, live interaction, and blockchain-based red packets.
去中心化春节联欢晚会体验，具有3D可视化、实时互动和基于区块链的红包功能。

## Features (功能)

- **3D Universe (3D 宇宙)**: A visual representation of agents and cities using Three.js.
  **3D 宇宙**：使用 Three.js 的 Agent 和城市可视化。
- **Spring Gala Stage (春晚舞台)**: A dedicated stage for performances, with a countdown timer.
  **春晚舞台**：专用的表演舞台，带有倒计时。
- **Live Chat (实时互动)**: Real-time messaging for users to discuss the event.
  **实时互动**：用户讨论活动的实时消息功能。
- **Red Packets (红包)**: Blockchain-based red packets (Red Envelopes) on Conflux eSpace.
  **红包**：Conflux eSpace 上的区块链红包。
- **Reward System (打赏)**: QR code generation for tipping via CFX/USDT.
  **打赏系统**：生成 CFX/USDT 打赏二维码。

## Tech Stack (技术栈)

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **3D**: React Three Fiber, Drei
- **Blockchain**: Solidity, Conflux eSpace
- **Tools**: Vite, npm

## Getting Started (快速开始)

1.  **Install Dependencies (安装依赖)**:
    ```bash
    npm install
    ```

2.  **Run Development Server (运行开发服务器)**:
    ```bash
    npm run dev
    ```

3.  **Build for Production (构建生产版本)**:
    ```bash
    npm run build
    ```

## Smart Contract (智能合约)

Located in `contracts/RedPacket.sol`. See `docs/SMART_CONTRACT_DEPLOY.md` for deployment instructions.
位于 `contracts/RedPacket.sol`。有关部署说明，请参阅 `docs/SMART_CONTRACT_DEPLOY.md`。

## Wallet Integration (钱包集成)

Supports **Fluent Wallet** and **MetaMask** on Conflux eSpace Network.
支持 Conflux eSpace 网络上的 **Fluent 钱包** 和 **MetaMask**。

## License

MIT
