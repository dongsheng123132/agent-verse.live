const { ethers } = require("hardhat");

async function main() {
  const [sender] = await ethers.getSigners();
  
  // 从命令行参数获取合约地址和金额
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const amount = process.env.FUND_AMOUNT || "1"; // 默认 1 CFX

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS environment variable");
    console.log("Example: CONTRACT_ADDRESS=0x... npx hardhat run scripts/fund.cjs --network confluxTestnet");
    process.exit(1);
  }

  console.log("Funding RedPacket contract...");
  console.log("Contract:", contractAddress);
  console.log("Amount:", amount, "CFX");
  console.log("From:", sender.address);

  // 连接到已部署的合约
  const RedPacket = await ethers.getContractFactory("RedPacket");
  const redPacket = RedPacket.attach(contractAddress);

  // 调用 deposit 函数并发送 CFX
  const tx = await redPacket.deposit({
    value: ethers.parseEther(amount),
  });

  console.log("\n⏳ Transaction sent:", tx.hash);
  await tx.wait();

  console.log("✅ Funded successfully!");
  
  // 查询合约余额
  const balance = await redPacket.getBalance();
  console.log("Contract balance:", ethers.formatEther(balance), "CFX");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Funding failed:", error);
    process.exit(1);
  });
