const hre = require("hardhat");

async function main() {
  console.log("Deploying RedPacketMonad to Monad Testnet...");

  // Monad Testnet Config (ensure hardhat.config.js has this network)
  // Network Name: monad-testnet
  // RPC URL: https://testnet-rpc.monad.xyz/
  // Chain ID: 10143
  // Currency Symbol: MON

  const minAmount = hre.ethers.parseEther("0.1"); // 0.1 MON
  const maxAmount = hre.ethers.parseEther("1.0"); // 1.0 MON

  const RedPacket = await hre.ethers.getContractFactory("RedPacketMonad");
  const redPacket = await RedPacket.deploy(minAmount, maxAmount);

  await redPacket.waitForDeployment();

  const address = await redPacket.getAddress();
  console.log(`RedPacketMonad deployed to: ${address}`);

  // Deploy Demo Version
  const RedPacketDemo = await hre.ethers.getContractFactory("RedPacketDemoMonad");
  const redPacketDemo = await RedPacketDemo.deploy(minAmount, maxAmount);
  await redPacketDemo.waitForDeployment();
  const demoAddress = await redPacketDemo.getAddress();
  console.log(`RedPacketDemoMonad deployed to: ${demoAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
