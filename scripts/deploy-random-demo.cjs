const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 部署 RedPacketRandomDemo 合约（演示模式 - 随机金额 + 无限领取）");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("部署账户:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", ethers.formatEther(balance), "CFX");

  // 部署参数：最小 0.001 CFX，最大 0.01 CFX（小额随机，适合演示）
  const minAmount = ethers.parseEther("0.001");  // 最小 0.001 CFX
  const maxAmount = ethers.parseEther("0.01");   // 最大 0.01 CFX
  
  console.log("\n部署参数:");
  console.log("  最小金额:", ethers.formatEther(minAmount), "CFX");
  console.log("  最大金额:", ethers.formatEther(maxAmount), "CFX");
  console.log("  特点: 随机金额 + 无限领取");
  
  const RedPacketRandomDemo = await ethers.getContractFactory("RedPacketRandomDemo");
  const contract = await RedPacketRandomDemo.deploy(minAmount, maxAmount);
  
  console.log("\n⏳ 部署交易已发送...");
  console.log("  交易哈希:", contract.deploymentTransaction().hash);
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  const chainId = (await ethers.provider.getNetwork()).chainId;
  
  console.log("\n✅ RedPacketRandomDemo 部署成功!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("合约地址:", contractAddress);
  console.log("Chain ID:", chainId.toString());
  
  if (chainId === 71n) {
    console.log("浏览器:", `https://evmtestnet.confluxscan.net/address/${contractAddress}`);
  } else if (chainId === 1030n) {
    console.log("浏览器:", `https://evm.confluxscan.net/address/${contractAddress}`);
  }
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n🎉 演示模式特点：");
  console.log("  ✅ 随机金额（0.001 ~ 0.01 CFX）");
  console.log("  ✅ 无限领取（不限制次数）");
  console.log("  ✅ 支持批量领取 claimBatch(次数)");
  console.log("  ✅ 每次金额随机，更有趣！");
  
  console.log("\n📋 合约函数:");
  console.log("  claim() - 领取一次随机红包");
  console.log("  claimBatch(times) - 批量领取（1-50次）");
  console.log("  getStats() - 查看合约统计");
  console.log("  getClaimCount(address) - 查看某地址领取次数");
  console.log("  deposit() - 管理员充值（payable）");
  
  // 保存信息
  const fs = require("fs");
  const info = {
    contract: "RedPacketRandomDemo",
    address: contractAddress,
    network: chainId === 71n ? "Conflux eSpace Testnet" : "Conflux eSpace Mainnet",
    chainId: chainId.toString(),
    deployer: deployer.address,
    minAmount: ethers.formatEther(minAmount) + " CFX",
    maxAmount: ethers.formatEther(maxAmount) + " CFX",
    transactionHash: contract.deploymentTransaction().hash,
    explorer: chainId === 71n 
      ? `https://evmtestnet.confluxscan.net/address/${contractAddress}`
      : `https://evm.confluxscan.net/address/${contractAddress}`
  };
  
  fs.writeFileSync("deployment-random-demo.json", JSON.stringify(info, null, 2));
  
  console.log("\n📝 部署信息已保存到 deployment-random-demo.json");
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:", error);
    process.exit(1);
  });
