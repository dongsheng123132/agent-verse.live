/**
 * 直接使用 Ethers.js 部署 RedPacket 合约到 Conflux eSpace
 * Direct deployment using Ethers.js to Conflux eSpace
 * 
 * 使用方法 / Usage:
 * 1. 设置环境变量 PRIVATE_KEY (去掉 0x 前缀)
 *    export PRIVATE_KEY=your_private_key_here
 * 
 * 2. 运行脚本 / Run script:
 *    node deploy-direct.cjs
 */

const { ethers } = require("ethers");
require("dotenv").config();

// RedPacket 合约 ABI (编译后生成 / Generated after compilation)
const REDPACKET_ABI = [
  "constructor(uint256 _minAmount, uint256 _maxAmount)",
  "function deposit() external payable",
  "function claim() external",
  "function setAmountRange(uint256 _min, uint256 _max) external",
  "function emergencyWithdraw() external",
  "function transferOwnership(address newOwner) external",
  "function getBalance() external view returns (uint256)",
  "function checkClaimed(address user) external view returns (bool)",
  "function hasClaimed(address) external view returns (bool)",
  "function getRemainingPackets() external view returns (uint256)",
  "function minAmount() external view returns (uint256)",
  "function maxAmount() external view returns (uint256)",
  "function owner() external view returns (address)",
  "function packetCount() external view returns (uint256)",
  "function totalBalance() external view returns (uint256)",
  "event Deposit(address indexed sender, uint256 amount)",
  "event Claim(address indexed user, uint256 amount)",
  "event ConfigUpdated(uint256 minAmount, uint256 maxAmount)",
  "event EmergencyWithdraw(uint256 amount)"
];

// RedPacket 合约 Bytecode (需要在编译后填入 / Fill in after compilation)
// 暂时为空，需要用户使用 Remix 编译后填入
const REDPACKET_BYTECODE = ""; 

async function deployToTestnet() {
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.error("❌ 错误: 请设置 PRIVATE_KEY 环境变量");
    console.error("   Error: Please set PRIVATE_KEY environment variable");
    console.log("\n示例 / Example:");
    console.log("  export PRIVATE_KEY=your_private_key_without_0x_prefix");
    process.exit(1);
  }

  // 清理私钥格式
  const cleanPrivateKey = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;

  // Conflux eSpace Testnet 配置
  const provider = new ethers.JsonRpcProvider("https://evmtestnet.confluxrpc.com", {
    name: "conflux-espace-testnet",
    chainId: 71,
  });

  const wallet = new ethers.Wallet(cleanPrivateKey, provider);
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 RedPacket 合约部署 / Contract Deployment");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", "Conflux eSpace Testnet");
  console.log("Chain ID:", 71);
  console.log("Deployer:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "CFX");
  
  if (balance === 0n) {
    console.error("\n❌ 错误: 账户余额为零，无法支付 gas 费用");
    console.error("   Error: Account balance is zero");
    console.log("\n请从水龙头获取测试币 / Get test tokens from faucet:");
    console.log("  https://faucet.confluxnetwork.org/");
    process.exit(1);
  }

  // 部署参数
  const minAmount = ethers.parseEther("0.01");  // 最小 0.01 CFX
  const maxAmount = ethers.parseEther("0.1");   // 最大 0.1 CFX
  
  console.log("\n📋 部署参数 / Deployment Parameters:");
  console.log("  Min Amount:", ethers.formatEther(minAmount), "CFX");
  console.log("  Max Amount:", ethers.formatEther(maxAmount), "CFX");

  // 检查 Bytecode
  if (!REDPACKET_BYTECODE || REDPACKET_BYTECODE === "") {
    console.log("\n⚠️  注意: REDPACKET_BYTECODE 为空");
    console.log("   需要使用 Hardhat 编译合约，或使用 Remix IDE 部署");
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📖 推荐使用 Remix IDE 部署:");
    console.log("   https://remix.ethereum.org");
    console.log("   参考文档: docs/SMART_CONTRACT_DEPLOY.md");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return;
  }

  // 部署合约
  console.log("\n⏳ 正在部署合约... / Deploying contract...");
  
  const factory = new ethers.ContractFactory(REDPACKET_ABI, REDPACKET_BYTECODE, wallet);
  const contract = await factory.deploy(minAmount, maxAmount);
  
  console.log("  Transaction hash:", contract.deploymentTransaction().hash);
  console.log("  Waiting for confirmation...");
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  console.log("\n✅ 部署成功! / Deployment successful!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Explorer:", `https://evmtestnet.confluxscan.net/address/${contractAddress}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // 保存部署信息
  const deploymentInfo = {
    network: "Conflux eSpace Testnet",
    chainId: 71,
    contractAddress,
    owner: wallet.address,
    minAmount: minAmount.toString(),
    maxAmount: maxAmount.toString(),
    deploymentTime: new Date().toISOString(),
    explorerUrl: `https://evmtestnet.confluxscan.net/address/${contractAddress}`,
  };

  console.log("\n📝 部署信息 / Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

// 如果 Bytecode 已填入，执行部署
if (REDPACKET_BYTECODE && REDPACKET_BYTECODE !== "") {
  deployToTestnet()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("\n❌ 部署失败 / Deployment failed:", error);
      process.exit(1);
    });
} else {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 RedPacket 智能合约部署工具");
  console.log("   RedPacket Smart Contract Deployment Tool");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n⚠️  Bytecode 未设置，无法自动部署");
  console.log("   Bytecode not set, cannot auto-deploy\n");
  console.log("📖 请使用以下方式部署:");
  console.log("   1. Remix IDE (推荐): https://remix.ethereum.org");
  console.log("      参考文档: docs/SMART_CONTRACT_DEPLOY.md");
  console.log("   2. Hardhat: npx hardhat run scripts/deploy.cjs --network confluxTestnet");
  console.log("   3. 等待 Hardhat 编译器下载完成后使用");
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
