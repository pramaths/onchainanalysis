const getBalanceUrl = (address) => {
    return `address/${address}`;
};

const getNormalTransactionUrl = (address, lastSeenTxId = " ") => {
   return `address/${address}/txs/chain/${lastSeenTxId}`
};


const txHash = (txHash, api_key = '') => {
    const apiKeyParam = api_key ? `&apikey=${api_key}` : '';
    return `tx/${txHash}${apiKeyParam}`;
}


module.exports = { getBalanceUrl, getNormalTransactionUrl, txHash };