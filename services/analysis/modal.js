const axios = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const alchemy = new Alchemy({
	apiKey: "snS3eJB5XGW05owmtbdnGi6FF04ltCkc",
	network: Network.ETH_MAINNET,
});


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
