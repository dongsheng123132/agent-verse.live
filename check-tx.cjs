const { ethers } = require("ethers");

async function checkTransaction() {
  // 尝试主网
  const provider = new ethers.JsonRpcProvider("https://evm.confluxrpc.com");
  
  const txHash = "0xa42cfb86cf2c022e8caf8480675b11ca30b106504a0c88864c3e96852a35c64e";
  
  try {
    console.log("正在查询交易...\n");
    
    // 获取交易详情
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      console.log("❌ 交易不存在或未确认");
      return;
    }
    
    console.log("✅ 交易信息：");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("交易哈希:", tx.hash);
    console.log("发送方:", tx.from);
    console.log("接收方:", tx.to || "【合约创建】");
    console.log("Gas Limit:", tx.gasLimit.toString());
    console.log("Gas Price:", ethers.formatUnits(tx.gasPrice, "gwei"), "gwei");
    console.log("Value:", ethers.formatEther(tx.value), "CFX");
    console.log("Nonce:", tx.nonce);
    
    // 获取交易收据
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt) {
      console.log("\n📋 交易收据：");
      console.log("状态:", receipt.status === 1 ? "✅ 成功" : "❌ 失败");
      console.log("Gas 消耗:", receipt.gasUsed.toString());
      console.log("区块号:", receipt.blockNumber);
      console.log("合约地址:", receipt.contractAddress || "N/A");
      
      if (receipt.contractAddress) {
        console.log("\n🎉 合约部署成功！");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("合约地址:", receipt.contractAddress);
        console.log("浏览器:", `https://evmtestnet.confluxscan.net/address/${receipt.contractAddress}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        // 查询合约余额
        const balance = await provider.getBalance(receipt.contractAddress);
        console.log("\n💰 合约余额:", ethers.formatEther(balance), "CFX");
      }
    }
    
  } catch (error) {
    console.error("查询失败:", error.message);
  }
}

checkTransaction();
