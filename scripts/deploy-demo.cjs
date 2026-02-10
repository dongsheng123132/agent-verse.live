const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 部署 RedPacketDemo 合约（演示模式 - 无限领取）");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("部署账户:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", ethers.formatEther(balance), "CFX");

  // 部署参数：固定金额 0.01 CFX，最大单次 0.1 CFX
  const fixedAmount = ethers.parseEther("0.01");  // 每次领 0.01 CFX
  const maxPerClaim = ethers.parseEther("0.1");   // 批量领取最大 0.1 CFX
  
  console.log("\n部署参数:");
  console.log("  固定金额:", ethers.formatEther(fixedAmount), "CFX");
  console.log("  最大单次:", ethers.formatEther(maxPerClaim), "CFX");
  
  const RedPacketDemo = await ethers.getContractFactory("RedPacketDemo");
  const contract = await RedPacketDemo.deploy(fixedAmount, maxPerClaim);
  
  console.log("\n⏳ 部署交易已发送...");
  console.log("  交易哈希:", contract.deploymentTransaction().hash);
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  const chainId = (await ethers.provider.getNetwork()).chainId;
  
  console.log("\n✅ RedPacketDemo 部署成功!");
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
  console.log("  ✅ 用户可以无限次领取");
  console.log("  ✅ 每次固定 0.01 CFX");
  console.log("  ✅ 支持批量领取 claimBatch(次数)");
  console.log("  ✅ 方便演示，无需换地址");
  
  console.log("\n📋 合约函数:");
  console.log("  claim() - 领取一次红包");
  console.log("  claimBatch(times) - 批量领取（1-100次）");
  console.log("  getStats() - 查看合约统计");
  console.log("  getClaimCount(address) - 查看某地址领取次数");
  console.log("  deposit() - 管理员充值（payable）");
  
  // 保存信息到文件
  const fs = require("fs");
  const info = {
    contract: "RedPacketDemo",
    address: contractAddress,
    network: chainId === 71n ? "Conflux eSpace Testnet" : "Conflux eSpace Mainnet",
    chainId: chainId.toString(),
    deployer: deployer.address,
    fixedAmount: ethers.formatEther(fixedAmount) + " CFX",
    maxPerClaim: ethers.formatEther(maxPerClaim) + " CFX",
    transactionHash: contract.deploymentTransaction().hash,
    explorer: chainId === 71n 
      ? `https://evmtestnet.confluxscan.net/address/${contractAddress}`
      : `https://evm.confluxscan.net/address/${contractAddress}`
  };
  
  fs.writeFileSync("deployment-demo.json", JSON.stringify(info, null, 2));
  
  console.log("\n📝 部署信息已保存到 deployment-demo.json");
  console.log(JSON.stringify(info, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:", error);
    process.exit(1);
  });
