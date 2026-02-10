require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Conflux eSpace Mainnet
    conflux: {
      url: "https://evm.confluxrpc.com",
      chainId: 1030,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Conflux eSpace Testnet
    confluxTestnet: {
      url: "https://evmtestnet.confluxrpc.com",
      chainId: 71,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      conflux: "your-api-key",
    },
    customChains: [
      {
        network: "conflux",
        chainId: 1030,
        urls: {
          apiURL: "https://api.confluxscan.net/api",
          browserURL: "https://evm.confluxscan.net",
        },
      },
      {
        network: "confluxTestnet",
        chainId: 71,
        urls: {
          apiURL: "https://api-testnet.confluxscan.net/api",
          browserURL: "https://evmtestnet.confluxscan.net",
        },
      },
    ],
  },
};
