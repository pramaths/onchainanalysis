const getBalanceUrl = (address, api_key = '') => {
    return `address/${address}`;
};

const getNormalTransactionUrl = (address, api_key = '', lastSeenTxId = " ") => {
   return `address/${address}/txs/chain/${lastSeenTxId}`
};


const txHash = (txHash, api_key = '') => {
    const apiKeyParam = api_key ? `&apikey=${api_key}` : '';
    return `tx/${txHash}${apiKeyParam}`;
}