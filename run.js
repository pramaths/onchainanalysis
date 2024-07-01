const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const runApp = async () => {
  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE0OWZiNmVmLTFlMjEtNDEwOC1hOGEyLTMyZWNhYmIwZDIyYSIsIm9yZ0lkIjoiMzgwOTMyIiwidXNlcklkIjoiMzkxNDI0IiwidHlwZUlkIjoiYmUzNWFhZDgtNjllYi00MGI3LWFlZWYtYzA2NDJiY2ZmNGY0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDk0MDUxNDQsImV4cCI6NDg2NTE2NTE0NH0.X2AL9Ir4Maawo1KiS7A2HxF6eyJewCD80mkRioQdzsA",
  });

  const address = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";

const chains = [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON , EvmChain.ARBITRUM, EvmChain.AVALANCHE, EvmChain.BASE, EvmChain.CHILIZ, EvmChain.CRONOS, EvmChain.FANTOM, EvmChain.PALM, EvmChain.LINEA, EvmChain.OPTIMISM, EvmChain.GNOSIS];

  const response = await Moralis.EvmApi.wallets.getWalletActiveChains({
    address,
    chains,
  });

  console.log(response.toJSON());
  console.log(response.raw)
  console.log(JSON.stringify(response.toJSON(), null, 2));
}

runApp();