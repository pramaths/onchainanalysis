const {
  getBalanceUrl,
  getNormalTransactionUrl,
  txHash
} = require("./Queryparams");
const { tronSDK } = require("./BaseUrl");
const {tronChainSerializer} = require("../../../serializers/tronSerializer");
const client = tronSDK();

async function getAccountBalance(address) {
  try {
    const url = getBalanceUrl(address);
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching account balance:', error.message);
    throw error;
  }
}

async function getNormalTransactions(address) {
  try {
    const url = getNormalTransactionUrl(address);
    const response = await client.get(url);
    const formattedData = tronChainSerializer(response.data);
    return formattedData;
  } catch (error) {
    console.error('Error fetching normal transactions:', error.message);
    throw error;
  }
}

async function getTransactionInfo(transactionHash) {
  try {
    const url = txHash(transactionHash);
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction info:', error.message);
    throw error;
  }
}

module.exports = {
  getAccountBalance,
  getNormalTransactions,
  getTransactionInfo,
};