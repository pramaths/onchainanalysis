const axios = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const alchemy = new Alchemy({
	apiKey: "snS3eJB5XGW05owmtbdnGi6FF04ltCkc",
	network: Network.ETH_MAINNET,
});
const sdk = require("api")("@chainabuse/v1.2#aea8f8elq1h521h");

sdk.auth(
	"ca_TlBxTTZweHNGRkxpa2ZKWkZIemJsdWpJLklSRVc5R2QyUnVvb3pMY3plU3RVeEE9PQ",
	"ca_TlBxTTZweHNGRkxpa2ZKWkZIemJsdWpJLklSRVc5R2QyUnVvb3pMY3plU3RVeEE9PQ"
);

// Utility function to fetch balance from Etherscan
const fetchBalanceFromEtherscan = async (address) => {
	const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=HVHTPWF3UJ8P5ZEDNUZYMT28ZZNEEURRD4`;
	const response = await axios.get(url);
	return response.data.result;
};
// Corrected blnce function
const blnce = async (address) => {
	try {
		const url = `https://services.tokenview.io/vipapi/addr/b/btc/${address}?apikey=Oxu0AV7QsNfxfix5amPs`;
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error('Error fetching balance:', error);
		throw error; // Rethrow to handle it in the calling function
	}
};

// // Updated mals function to correctly handle promises
// const mals = async (address) => {
// 	try {
// 		const response = await sdk.reports({
// 			address: address,
// 			includePrivate: "false",
// 			page: "1",
// 			perPage: "50",
// 		});
      
// 		return response.data.data;
// 	} catch (error) {
// 		console.error('Error fetching malicious reports:', error);
// 		throw error; // Rethrow to handle it in the calling function
// 	}
// };


// Controller to handle the combined data fetching
const getCryptoData = async (req, res) => {
	try {
		const { address } = req.params;
		const balancePromise = fetchBalanceFromEtherscan(address);
		// const falgmalicious = mals(address);
		const transactionCountPromise = alchemy.core.getTransactionCount(address);
		const getBalance = blnce(address)
		const labels = {
			currencies: [
				{
					currency: "btc",
					addresses: ["33TbzA5AMiTKUCmeVEdsnTj3GiVXuavCAH"],
					txs: [],
				},
			],
			labels: [],
			actors: [],
		};
		// Await both promises simultaneously for efficiency
		const [balance, transactionCount,bitcoin_balance] = await Promise.all([
			balancePromise,
			transactionCountPromise,
			// falgmalicious,
			getBalance,
			

		]);

		// Combine the data into a single object
		const combinedData = {
			address,
			balance,
			transactionCount,
			// malicious,
			bitcoin_balance,
			labels,
		};

		res.json(combinedData);
	} catch (error) {
		console.error(error);
		res.status(500).send("An error occurred while fetching cryptocurrency data.");
	}
};

module.exports = { getCryptoData };
