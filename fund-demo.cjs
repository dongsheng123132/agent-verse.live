const { ethers } = require("ethers");
require("dotenv").config();

async function fund() {
  const provider = new ethers.JsonRpcProvider("https://evmtestnet.confluxrpc.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const CONTRACT_ADDRESS = "0xD2a90decC11418Cc6A2411BEe7a31fA6bc4F7C91";
  const AMOUNT = "5"; // 充值 5 CFX
  
  console.log("💰 充值红包合约\n");
  console.log("合约地址:", CONTRACT_ADDRESS);
  console.log("充值金额:", AMOUNT, "CFX");
  console.log("从地址:", wallet.address);
  
  // ABI 只需要 deposit 函数
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
    console.log("合约余额:", ethers.formatEther(balance), "CFX");
    console.log("可领取次数:", Math.floor(Number(ethers.formatEther(balance)) / 0.01), "次");
    
  } catch (error) {
    console.error("❌ 充值失败:", error.message);
  }
}

fund();
