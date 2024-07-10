const { Network, Alchemy } = require("alchemy-sdk");

const Alchemy_API_LIST = [
    process.env.ALCHEMY1_API_KEY,
    process.env.ALCHEMY2_API_KEY,
];

let cur=0;


const alchemy = new Alchemy({
	apiKey: process.env.ALCHEMY1_API_KEY,
	network: Network.MATIC_MAINNET,
});


