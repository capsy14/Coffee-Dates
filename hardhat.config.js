require("@nomicfoundation/hardhat-toolbox");

// require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = "https://eth-sepolia.g.alchemy.com/v2/wMZHMhYB6wfyoa9NfS2kAq4Efnw7Fg6B";
const PRIVATE_KEY = "95264df05305fc4561d63c9596464de1b64139bc6637e84e1bbfb6a8a1a3a746";
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY]
    },
    
  },
  paths:{
    artifacts:"./client/src/artifacts",
  }, 
};