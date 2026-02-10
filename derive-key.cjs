const { ethers } = require("ethers");

async function deriveKey() {
  const mnemonic = "century rural burden tired harvest earth true dumb throw rude spawn frozen";
  
  console.log("📝 从助记词派生私钥\n");
  console.log("助记词:", mnemonic);
  
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  
  console.log("\n📋 钱包信息:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("地址:", wallet.address);
  console.log("私钥:", wallet.privateKey);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // 检查余额
  const provider = new ethers.JsonRpcProvider("https://evmtestnet.confluxrpc.com");
  const balance = await provider.getBalance(wallet.address);
  console.log("\n💰 测试网余额:", ethers.formatEther(balance), "CFX");
  
  // 保存到 .env
  const fs = require("fs");
  fs.writeFileSync(".env", `PRIVATE_KEY=${wallet.privateKey.slice(2)}\n`);
  console.log("\n✅ 私钥已保存到 .env 文件");
}

deriveKey().catch(console.error);
