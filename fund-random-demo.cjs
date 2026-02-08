const { ethers } = require("ethers");
require("dotenv").config();

async function fund() {
  const provider = new ethers.JsonRpcProvider("https://evmtestnet.confluxrpc.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const CONTRACT_ADDRESS = "0x8deb52e05B4664DAe9a2f382631436fa1FF501aa";
  const AMOUNT = "0.15"; // 充值 0.1 CFX
  
  console.log("💰 充值随机红包合约（演示模式）\n");
  console.log("合约地址:", CONTRACT_ADDRESS);
  console.log("充值金额:", AMOUNT, "CFX");
  console.log("从地址:", wallet.address);
  
  const abi = ["function deposit() external payable"];
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
  
  try {
    const tx = await contract.deposit({
      value: ethers.parseEther(AMOUNT)
    });
    
    console.log("\n⏳ 交易发送:", tx.hash);
    await tx.wait();
    
    console.log("✅ 充值成功!");
    
    // 查询余额
    const balance = await provider.getBalance(CONTRACT_ADDRESS);
    console.log("\n📊 合约状态:");
    console.log("  合约余额:", ethers.formatEther(balance), "CFX");
    console.log("  可领取次数(按最大):", Math.floor(Number(ethers.formatEther(balance)) / 0.01), "次");
    console.log("  可领取次数(按最小):", Math.floor(Number(ethers.formatEther(balance)) / 0.001), "次");
    
  } catch (error) {
    console.error("\n❌ 充值失败:", error.message);
  }
}

fund();
