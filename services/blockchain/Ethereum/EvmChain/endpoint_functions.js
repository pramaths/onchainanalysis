const axios = require('axios');
const { explorers } = require('./BaseUrl');
const { getBalanceUrl, getNormalTransactionUrl, getInternalTransactionUrl } = require('./Queryparams');

const getUrlForProvider = (providerName) => {
    const explorer = explorers.find(ex => ex.name.toLowerCase() === providerName.toLowerCase());
    return explorer ? explorer.url : null;
};

const balance = async (address, providerConfigs) => {
    const results = await Promise.all(providerConfigs.map(async providerConfig => {
        try {
            const baseUrl = getUrlForProvider(providerConfig.providerName);
            if (!baseUrl) throw new Error("Provider URL not found for " + providerConfig.providerName);
            const url = baseUrl + getBalanceUrl(address, providerConfig.apiKey);
            const response = await axios.get(url);
             return {
                data: response.data,
                providerName: providerConfig.providerName // Always include provider name
            };
        } catch (error) {
            return { error: true, providerName: providerConfig.providerName, message: error.message };
        }
    }));
    return results;
}

const normalTransactions = async (address, providerConfigs) => {
    const results = await Promise.all(providerConfigs.map(async providerConfig => {
        try {
            const baseUrl = getUrlForProvider(providerConfig.providerName);
            if (!baseUrl) throw new Error("Provider URL not found for " + providerConfig.providerName);
            const url = baseUrl + getNormalTransactionUrl(address, providerConfig.apiKey);
            const response = await axios.get(url);
             return {
                data: response.data,
                providerName: providerConfig.providerName // Always include provider name
            };
        } catch (error) {
            return { error: true, providerName: providerConfig.providerName, message: error.message };
        }
    }));
    return results;
}

const internalTransactions = async (providerConfigs, address) => {
    const results = await Promise.all(providerConfigs.map(async providerConfig => {
        try {
            const baseUrl = getUrlForProvider(providerConfig.providerName);
            if (!baseUrl) throw new Error("Provider URL not found for " + providerConfig.providerName);
            const url = baseUrl + getInternalTransactionUrl(address, providerConfig.apiKey);
            const response = await axios.get(url);
             return {
                data: response.data,
                providerName: providerConfig.providerName // Always include provider name
            };
        } catch (error) {
            return { error: true, providerName: providerConfig.providerName, message: error.message };
        }
    }));
    return results;
}

module.exports = { balance, normalTransactions, internalTransactions };
