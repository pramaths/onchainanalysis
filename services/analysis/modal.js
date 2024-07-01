const axios = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const alchemy = new Alchemy({
	apiKey: "snS3eJB5XGW05owmtbdnGi6FF04ltCkc",
	network: Network.ETH_MAINNET,
});


// const Moralis = require("moralis").default;
// const { EvmChain } = require("@moralisweb3/common-evm-utils");

// const runApp = async () => {
// //   await Moralis.start({
// //     apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE0OWZiNmVmLTFlMjEtNDEwOC1hOGEyLTMyZWNhYmIwZDIyYSIsIm9yZ0lkIjoiMzgwOTMyIiwidXNlcklkIjoiMzkxNDI0IiwidHlwZUlkIjoiYmUzNWFhZDgtNjllYi00MGI3LWFlZWYtYzA2NDJiY2ZmNGY0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDk0MDUxNDQsImV4cCI6NDg2NTE2NTE0NH0.X2AL9Ir4Maawo1KiS7A2HxF6eyJewCD80mkRioQdzsA",
// //   });

//   const address = "0x26fcbd3afebbe28d0a8684f790c48368d21665b5";

//   const chains = [EvmChain.ETHEREUM, EvmChain.BSC, EvmChain.POLYGON , EvmChain.ARBITRUM, EvmChain.AVALANCHE, EvmChain.BASE, EvmChain.CHILIZ, EvmChain.CRONOS, EvmChain.FANTOM, EvmChain.HECO, EvmChain.KCC, EvmChain.OKEXCHAIN, EvmChain.OPTIMISM, EvmChain.PALM, EvmChain.XDAI, EvmChain.GNOSIS, EvmChain.zkSync];

//   const response = await Moralis.EvmApi.wallets.getWalletActiveChains({
//     address,
//     chains,
//   });

//   console.log(response.toJSON());
// }

// runApp();

const fetchBalanceFromEtherscan = async (address) => {
	const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=HVHTPWF3UJ8P5ZEDNUZYMT28ZZNEEURRD4`;
	const response = await axios.get(url);
	return response.data.result;
};

const tokens = async (address) => {
	const url = `https://api.etherscan.io/api?module=account&action=tokentx&&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=${address}&tag=latest&apikey=HVHTPWF3UJ8P5ZEDNUZYMT28ZZNEEURRD4`;
	const response = await axios.get(url);
	return response.data.result;
}

const getCryptoData = async (req, res) => {
	try {
		const { address } = req.params;
		const ethBalance = fetchBalanceFromEtherscan(address);
		const erctokens = tokens(address)
		const [balance, erctoks] =
			await Promise.all([
				ethBalance,
				erctokens
			]);
		const combinedData = {
			balance,
			erctoks
		};

		res.json(combinedData);
	} catch (error) {
		console.error(error);
		res.status(500).send("An error occurred while fetching cryptocurrency data.");
	}
};

module.exports = { getCryptoData };
