import hre from "hardhat";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Deploying EscalationAudit contract...");

  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("Deploying with account:", wallet.address);

  // Get contract artifact
  const artifact = await hre.artifacts.readArtifact("EscalationAudit");

  // Create contract factory
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  // Deploy
  console.log("Deploying contract...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("✅ EscalationAudit deployed to:", address);
  console.log("📝 Save this address - you'll need it!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });