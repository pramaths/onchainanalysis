const { urls } = require('./BaseUrl');
const { getBalanceUrl, getNormalTransactionUrl, getInternalTransactionUrl } = require('./Queryparams');


const balance = (api_key, address) => {
    return urls.map(url => url + getBalanceUrl(address, api_key));
}

const normalTransactions = (api_key, address) => {
    return urls.map(url => url + getNormalTransactionUrl(address, api_key));
}


const internalTransactions = (api_key, address) => {
    return urls.map(url => url + getInternalTransactionUrl(address, api_key));
}


module.exports = { balance, normalTransactions, internalTransactions };