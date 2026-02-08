const { ethers } = require("hardhat");

async function main() {
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // 部署参数：最小金额 0.01 CFX，最大金额 0.1 CFX
  const minAmount = ethers.parseEther("0.01");  // 0.01 CFX
  const maxAmount = ethers.parseEther("0.1");   // 0.1 CFX

  console.log("\nDeployment parameters:");
  console.log("Min Amount:", ethers.formatEther(minAmount), "CFX");
  console.log("Max Amount:", ethers.formatEther(maxAmount), "CFX");

  // 部署合约
  const RedPacket = await ethers.getContractFactory("RedPacket");
  const redPacket = await RedPacket.deploy(minAmount, maxAmount);

  await redPacket.waitForDeployment();

  const contractAddress = await redPacket.getAddress();
  
  console.log("\n✅ RedPacket deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("Contract:", contractAddress);
  console.log("Owner:", deployer.address);
  console.log("Min Amount:", ethers.formatEther(minAmount), "CFX");
  console.log("Max Amount:", ethers.formatEther(maxAmount), "CFX");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("\n🔗 Explorer URLs:");
  const chainId = (await ethers.provider.getNetwork()).chainId;
  if (chainId === 1030n) {
    console.log(`Mainnet: https://evm.confluxscan.net/address/${contractAddress}`);
  } else if (chainId === 71n) {
    console.log(`Testnet: https://evmtestnet.confluxscan.net/address/${contractAddress}`);
  }

  // 等待几个区块确认
  console.log("\n⏳ Waiting for block confirmations...");
  await redPacket.deploymentTransaction()?.wait(3);
  console.log("✅ Confirmed!");

  // 保存部署信息
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: chainId.toString(),
    contractAddress,
    owner: deployer.address,
    minAmount: minAmount.toString(),
    maxAmount: maxAmount.toString(),
    deploymentTime: new Date().toISOString(),
  };

  console.log("\n📝 Deployment Info (JSON):");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
