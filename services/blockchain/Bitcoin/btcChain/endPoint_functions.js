const {
  getBalanceUrl,
  getNormalTransactionUrl,
  txHash,
} = require("./queryParams");
const { btcscan, blockstream } = require("./baseUrl");
const {
  transformBitcoinTransaction,
} = require("../../../../serializers/btcSerializer");
const axios = require("axios");



const getBalance = async (address) => {
  try {
    const response = await axios.get(`${btcscan}${getBalanceUrl(address)}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching balance", error);
    return null;
  }
};


const getNormalTransactions = async (
  address,
  lastSeenTxId = null,
) => {
  try {
    let url;
    if (lastSeenTxId) {
      url = `${btcscan}${getNormalTransactionUrl(address, lastSeenTxId)}`;
    } else {
      url = `${btcscan}${getNormalTransactionUrl(address)}`;
    }

    const response = await axios.get(url);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }
};

const fetchTransactionDetails = async (txhash) => {
  const url = `${btcscan}${txHash(txhash)}`;
  console.log("URL:", url); 
  let address = "";
  try {
    const response = await axios.get(url);
    if(response.data.vin && response.data.vin.length > 0){
      if(response.data.vin[0].prevout && response.data.vin[0].prevout.scriptpubkey_address){
        address = response.data.vin[0].prevout.scriptpubkey_address;
      }
    }
    if(!response.data.vin){
      if(response.data.prevout && response.data.prevout.scriptpubkey_address){
        address = response.data.prevout.scriptpubkey_address;
      }
    }
    const formattedResponse = transformBitcoinTransaction(response.data, address);
    return formattedResponse;
  } catch (error) {
    console.error("Error in fetching transaction details", error);
    throw new Error("Failed to fetch transaction details");
  }
};

module.exports = {
  getBalance,
  getNormalTransactions,
  fetchTransactionDetails,
};
