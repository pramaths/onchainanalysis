const { urls } = require('./BaseUrl');
const { getBalanceUrl, getNormalTransactionUrl, getInternalTransactionUrl } = require('./Queryparams');


const balance = (api_key, address) => {
    return urls.map(url => url + getBalanceUrl(address, api_key));
}

const normalTransactions = (address, api_key) => {
    console.log("address&api_key",address, api_key)
    const url= urls.map(url => url + getNormalTransactionUrl(address, api_key));
    return url; 
}


const internalTransactions = (api_key, address) => {
    return urls.map(url => url + getInternalTransactionUrl(address, api_key));
}


module.exports = { balance, normalTransactions, internalTransactions };