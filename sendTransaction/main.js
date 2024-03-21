import 'dotenv/config';
import { zeroAddress } from 'viem';
import { getKernelClient } from './utils.mjs';

async function main() {
  const kernelClient = await getKernelClient();
  console.log("Account address:", kernelClient.account.address);

  const txnHash = await kernelClient.sendTransaction({
    to: "0xa2e2b84e1b8EA621dDfEDa820Da3bea34516c61B", 
    value: BigInt(0),
    data: "0x",
  });

  console.log("Txn hash:", txnHash);
}

main();