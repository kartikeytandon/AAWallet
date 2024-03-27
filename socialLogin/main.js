const { ParticleNetwork } = require("@particle-network/auth");
const { ParticleProvider } = require("@particle-network/provider");
const { createEcdsaKernelAccountClient } = require('@zerodev/presets/zerodev');
const { providerToSmartAccountSigner } = require('permissionless');
const { polygonMumbai } = require('viem/chains');

async function integrateWithZeroDev(projectId, clientKey, appId, chainName, chainId) {
  const particle = new ParticleNetwork({
    projectId,
    clientKey,
    appId,
    chainName,
    chainId,
  });
  
  const particleProvider = new ParticleProvider(particle.auth);

  const smartAccountSigner = await providerToSmartAccountSigner(particleProvider);

  const kernelClient = await createEcdsaKernelAccountClient({
    chain: polygonMumbai,
    projectId: process.env.ZERODEV_PROJECT_ID,
    signer: smartAccountSigner,
  });

  const kernelAddress = kernelClient.account.address;

  return kernelAddress;
}

const projectId = '4c205916-174f-448b-bb5b-5db74d0b52b3';
const clientKey = 'cqibf7m50Z7I9p1Qzjn7OHL6xQkyPjGSZ5hnDnk2';
const appId = '39dcbf68-aeb0-4fbc-9c19-397d128cd565';
const chainName = 'polygon-mumbai';
const chainId = '80001';

integrateWithZeroDev(projectId, clientKey, appId, chainName, chainId)
  .then(kernelAddress => {
    console.log('Integration successful! Kernel address:', kernelAddress);
  })
  .catch(error => {
    console.error('Integration failed:', error);
  });