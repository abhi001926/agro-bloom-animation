import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";  // Add this line
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
      type: "http"
    },
  },
};

export default config;