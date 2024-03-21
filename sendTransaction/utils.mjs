// Import necessary modules
import { createEcdsaKernelAccountClient } from "@zerodev/presets/zerodev";
import {
  createKernelAccountClient,
  createKernelV1Account,
  createZeroDevPaymasterClient
} from "@zerodev/sdk";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { http } from "viem";
import { polygonMumbai } from "viem/chains";

// Get environment variables
const zeroDevProjectId = process.env.ZERODEV_PROJECT_ID;
const bundlerRpc = process.env.BUNDLER_RPC;
const paymasterRpc = process.env.PAYMASTER_RPC;
const privateKey = generatePrivateKey()

// Check if required environment variables are set
if (!zeroDevProjectId || !privateKey) {
  throw new Error("ZERODEV_PROJECT_ID or PRIVATE_KEY is not set");
}

// Convert private key to account object
const signer = privateKeyToAccount(privateKey);

// Function to get Kernel client
export async function getKernelClient() {
  return await createEcdsaKernelAccountClient({
    chain: polygonMumbai,
    projectId: zeroDevProjectId,
    signer
  });
}

// Function to get Kernel V1 account
export async function getKernelV1Account() {
  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable not set");
  }

  if (!bundlerRpc) {
    throw new Error("BUNDLER_RPC environment variable not set");
  }

  const publicClient = http(bundlerRpc);
  const signer = privateKeyToAccount(privateKey);

  return createKernelV1Account(publicClient, {
    signer,
    index: BigInt(0)
  });
}

// Function to get Kernel V1 account client
export async function getKernelV1AccountClient({ account, sponsorUserOperation } = {}) {
  if (!bundlerRpc) {
    throw new Error("BUNDLER_RPC environment variable not set");
  }

  return createKernelAccountClient({
    account,
    chain: polygonMumbai,
    transport: http(bundlerRpc),
    sponsorUserOperation
  });
}

// Function to get ZeroDev paymaster client
export function getZeroDevPaymasterClient() {
  if (!paymasterRpc) {
    throw new Error("PAYMASTER_RPC environment variable not set");
  }

  return createZeroDevPaymasterClient({
    chain: polygonMumbai,
    transport: http(paymasterRpc)
  });
}

// Function to get ZeroDev ERC20 paymaster client
export function getZeroDevERC20PaymasterClient() {
  if (!zeroDevProjectId) {
    throw new Error("ZERODEV_PROJECT_ID environment variable not set");
  }

  return createZeroDevPaymasterClient({
    chain: polygonMumbai,
    transport: http(
      paymasterRpc || `https://rpc.zerodev.app/api/v2/paymaster/${zeroDevProjectId}`
    )
  });
}