require('dotenv').config();
const { createEcdsaKernelAccountClient } = require("@zerodev/presets/zerodev");
const { Hex, zeroAddress } = require("viem");
const { generatePrivateKey, privateKeyToAccount } = require("viem/accounts");
const { polygonMumbai } = require("viem/chains");

const zeroDevProjectId = process.env.ZERODEV_PROJECT_ID;

const privateKey = generatePrivateKey()
const signer = privateKeyToAccount(privateKey);

const main = async () => {
  const kernelClient = await createEcdsaKernelAccountClient({
    chain: polygonMumbai,
    projectId: zeroDevProjectId,
    signer,

    provider: "STACKUP",
    index: BigInt(1), 
    paymaster: 'SPONSOR', 
  });

  console.log("My account:", kernelClient.account.address);

  const txnHash = await kernelClient.sendTransaction({
    to: zeroAddress,
    value: BigInt(0),
    data: "0x",
  });

  console.log("txn hash:", txnHash);

  const userOpHash = await kernelClient.sendUserOperation({
    userOperation: {
      callData: await kernelClient.account.encodeCallData({
        to: zeroAddress,
        value: BigInt(0),
        data: "0x",
      }),
    },
  });

  console.log("userOp hash:", userOpHash);
};

main();