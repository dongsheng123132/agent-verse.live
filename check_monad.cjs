const { JsonRpcProvider, formatEther } = require('ethers');

const RPC_URL = "https://testnet-rpc.monad.xyz";
const ADDRESSES = [
    "0xe6EA7c31A85A1f42DFAc6C49155bE90722246890", // User provided
    "0x790Cd567214fAbf7B908f2b1c4805d9657405d8B"  // Previous memory
];

async function check() {
    const provider = new JsonRpcProvider(RPC_URL);
    console.log(`Checking addresses on Monad Testnet (${RPC_URL})...`);

    for (const addr of ADDRESSES) {
        console.log(`\n--- Checking ${addr} ---`);
        try {
            const code = await provider.getCode(addr);
            const isContract = code !== '0x';
            console.log(`Is Contract: ${isContract}`);
            
            const balance = await provider.getBalance(addr);
            console.log(`Balance: ${formatEther(balance)} MON`);
            
            const txCount = await provider.getTransactionCount(addr);
            console.log(`Tx Count: ${txCount}`);
        } catch (e) {
            console.error(`Error checking ${addr}:`, e.message);
        }
    }
}

check();