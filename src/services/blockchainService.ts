import { ethers } from "ethers";

// Your deployed contract address
const CONTRACT_ADDRESS = "0x470C6B01Be39D3F47EF7EEb89Fe564F0AfA51038";

// Contract ABI (simplified interface)
const CONTRACT_ABI = [
  "function createEscalation(string escalationId, string userId, string farmerName, string queryHash) public",
  "function recordOfficerResponse(string escalationId, string officerId, string responseHash, string status) public",
  "function getEscalation(string escalationId) public view returns (string, string, string, uint256, string, string)",
  "function getOfficerActions(string escalationId) public view returns (tuple(string officerId, uint256 timestamp, string responseHash, string action)[])",
  "function escalationExists(string escalationId) public view returns (bool)"
];

// RPC URL for Polygon Amoy Testnet
const RPC_URL = "https://rpc-amoy.polygon.technology";

// Private key for officer transactions (REPLACE WITH YOUR KEY)
const OFFICER_PRIVATE_KEY = "d70b76f843f257b73a5d411c1de182d64f5f9466a5684b1e1520b0b8c775baac"; // Replace with actual key (without 0x)

export const blockchainService = {

  /**
   * Create hash of text for privacy
   * Stores hash on blockchain instead of actual text
   */
  createHash: (text: string): string => {
    return ethers.keccak256(ethers.toUtf8Bytes(text));
  },

  /**
   * Record escalation creation on blockchain
   * Called when farmer creates escalation
   */
  recordEscalation: async (
    escalationId: string,
    userId: string,
    farmerName: string,
    query: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      console.log("📝 Recording escalation on blockchain...", escalationId);

      // Create hash of query for privacy
      const queryHash = blockchainService.createHash(query);

      // Connect to blockchain
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(OFFICER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

      // Check if escalation already exists
      const exists = await contract.escalationExists(escalationId);
      if (exists) {
        console.log("⚠️ Escalation already exists on blockchain");
        return {
          success: false,
          error: "Escalation already exists on blockchain",
        };
      }

      // Get current nonce to avoid duplicate transactions
      const nonce = await provider.getTransactionCount(wallet.address, "pending");

      // Get gas price
      const feeData = await provider.getFeeData();

      console.log("Sending transaction with nonce:", nonce);

      // Send transaction with proper settings
      const tx = await contract.createEscalation(
        escalationId,
        userId,
        farmerName,
        queryHash,
        {
          nonce: nonce,
          gasLimit: 500000,
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        }
      );

      console.log("⏳ Transaction sent:", tx.hash);
      console.log("⏳ Waiting for confirmation (this may take 10-30 seconds)...");

      // Wait for confirmation with timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Transaction timeout")), 60000)
        )
      ]) as any;

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      console.log("✅ Escalation recorded on blockchain!");

      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("❌ Blockchain error:", error);

      // Handle specific error cases
      if (error.message?.includes("already known")) {
        return {
          success: false,
          error: "Transaction already pending. Please wait 30 seconds and try again.",
        };
      }

      if (error.message?.includes("nonce too low")) {
        return {
          success: false,
          error: "Transaction conflict. Please refresh the page and try again.",
        };
      }

      if (error.message?.includes("timeout")) {
        return {
          success: false,
          error: "Transaction is taking longer than expected. Check blockchain explorer.",
        };
      }

      return {
        success: false,
        error: error.message || "Failed to record on blockchain"
      };
    }
  },

  /**
   * Record officer response on blockchain
   * Called when officer resolves escalation
   */
  recordOfficerAction: async (
    escalationId: string,
    officerId: string,
    response: string,
    status: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      console.log("📝 Recording officer action on blockchain...", escalationId);

      // Create hash of response for privacy
      const responseHash = blockchainService.createHash(response);

      // Connect to blockchain
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(OFFICER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

      // Check if escalation exists
      const exists = await contract.escalationExists(escalationId);
      if (!exists) {
        console.log("⚠️ Escalation doesn't exist on blockchain");
        return {
          success: false,
          error: "Escalation not found on blockchain",
        };
      }

      // Get current nonce
      const nonce = await provider.getTransactionCount(wallet.address, "pending");

      // Get gas price
      const feeData = await provider.getFeeData();

      console.log("Sending transaction with nonce:", nonce);

      // Send transaction
      const tx = await contract.recordOfficerResponse(
        escalationId,
        officerId,
        responseHash,
        status.toUpperCase(),
        {
          nonce: nonce,
          gasLimit: 500000,
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        }
      );

      console.log("⏳ Transaction sent:", tx.hash);
      console.log("⏳ Waiting for confirmation...");

      // Wait for confirmation with timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Transaction timeout")), 60000)
        )
      ]) as any;

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      console.log("✅ Officer action recorded on blockchain!");

      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("❌ Blockchain error:", error);

      if (error.message?.includes("already known")) {
        return {
          success: false,
          error: "Transaction already pending. Please wait 30 seconds and try again.",
        };
      }

      if (error.message?.includes("nonce too low")) {
        return {
          success: false,
          error: "Transaction conflict. Please refresh the page and try again.",
        };
      }

      if (error.message?.includes("timeout")) {
        return {
          success: false,
          error: "Transaction is taking longer than expected. Check blockchain explorer.",
        };
      }

      return {
        success: false,
        error: error.message || "Failed to record on blockchain"
      };
    }
  },

  /**
   * Get blockchain explorer URL for transaction
   */
  getExplorerUrl: (txHash: string): string => {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  },

  /**
   * Get blockchain explorer URL for contract
   */
  getContractExplorerUrl: (): string => {
    return `https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`;
  },

  /**
   * Read escalation data from blockchain (no gas cost)
   */
  getEscalationData: async (escalationId: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Check if escalation exists
      const exists = await contract.escalationExists(escalationId);
      if (!exists) {
        return null;
      }

      // Get escalation details
      const data = await contract.getEscalation(escalationId);

      return {
        escalationId: data[0],
        userId: data[1],
        farmerName: data[2],
        createdAt: Number(data[3]),
        queryHash: data[4],
        status: data[5],
      };
    } catch (error) {
      console.error("Error reading from blockchain:", error);
      return null;
    }
  },

  /**
   * Get all officer actions for an escalation
   */
  getOfficerActions: async (escalationId: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const actions = await contract.getOfficerActions(escalationId);

      return actions.map((action: any) => ({
        officerId: action.officerId,
        timestamp: Number(action.timestamp),
        responseHash: action.responseHash,
        action: action.action,
      }));
    } catch (error) {
      console.error("Error reading officer actions:", error);
      return [];
    }
  }
};