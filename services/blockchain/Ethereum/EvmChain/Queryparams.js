const getBalanceUrl = (address, api_key) => {
  return `?module=account&action=balance&address=${address}&tag=latest&apikey=${api_key}`;
};

const getNormalTransactionUrl = (address, api_key) => {
  return `?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${api_key}`;
};

const getInternalTransactionUrl = (address, api_key) => {
  return `?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=2702578&page=1&offset=10000&sort=asc&apikey=${api_key}`;
};


const getTxhashUrl = (txHash, api_key) => {
  return `?module=transaction&action=getstatus&txhash=${txHash}&apikey=${api_key}`;
};

module.exports = { getBalanceUrl, getNormalTransactionUrl, getInternalTransactionUrl, getTxhashUrl }; 
