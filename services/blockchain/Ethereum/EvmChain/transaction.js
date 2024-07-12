const { normalTransactions } = require('./endpoint_functions');
const {  fetchAndSortProviders,updateCurrentPointer} = require('../../../../db/providerService');
const logger = require('../../../../utils/logger');

async function getNextValidApiKey() {
    const providers = await fetchAndSortProviders(); // This returns all providers sorted by priority
    console.log('Providers:', providers);
    const urlProviders = providers.filter(provider => provider.type === 'URL');
    const sdkProviders = providers.filter(provider => provider.type === 'SDK');
    console.log('URL Providers:', urlProviders);

    // Helper function to find the next valid API key
    async function findApiKey(providerList) {
        for (let provider of providerList) {
            if (provider.currentPointer < provider.apiKeys.length) {
                const apiKey = provider.apiKeys[provider.currentPointer];
                provider.currentPointer = (provider.currentPointer + 1) % provider.apiKeys.length;
                await updateCurrentPointer(provider._id, provider.currentPointer);
                return { apiKey, providerName: provider.providerName };
            }
        }
        return null;
    }

    // Try to get API key from URL providers first
    let apiKeyInfo = await findApiKey(urlProviders);
    if (apiKeyInfo) {
        return apiKeyInfo;
    }

    // If no URL API key found, try SDK providers
    apiKeyInfo = await findApiKey(sdkProviders);
    if (apiKeyInfo) {
        return apiKeyInfo;
    }

    // If no API key found in both lists
    throw new Error("All API keys exhausted across all providers");
}


const getNormalTransactions = async (req, res) => {
    try {
        const { address } = req.params;
        console.log(`Fetching normal transactions for address: ${address}`);

        let apiKeyInfo;
        let response;

        try {
            apiKeyInfo = await getNextValidApiKey();
            if (!apiKeyInfo) {
                throw new Error("No valid API keys available.");
            }
            console.log(`Using provider: ${apiKeyInfo.providerName}`);
            logger.info(`Using provider: ${apiKeyInfo.providerName}`);
            console.log(`Using API key: ${apiKeyInfo.apiKey}`);
            response = await normalTransactions(address, apiKeyInfo.apiKey);
        } catch (error) {
            console.error(`Operation failed with provider ${apiKeyInfo ? apiKeyInfo.providerName : 'unknown'}:`, error.message);
            logger.error(`Operation failed: ${error.message}`);
            return res.status(500).send(error.message);
        }

        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred while fetching normal transactions");
    }
}

module.exports = { getNormalTransactions };
