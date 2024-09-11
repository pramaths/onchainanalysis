const getBalanceUrl = (address) => {
    return `/accountv2?address=${address}`;
};

const getNormalTransactionUrl = (address) => {
   return `/transfer/trx?address=${address}&start=0&limit=20`
};


const txHash = (txHash) => {
    return `/transaction-info?hash=${txHash}`;
}


module.exports = { getBalanceUrl, getNormalTransactionUrl, txHash };
