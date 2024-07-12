const { normalTransactions } = require('./endpoint_functions');
const {  fetchAndSortProviders,updateCurrentPointer} = require('../../../../db/providerService');
const logger = require('../../../../utils/logger');

async function getNextValidApiKey() {
    const providers = await fetchAndSortProviders(); // This returns all providers sorted by priority
    console.log('Providers:', providers);
    const urlProviders = providers.filter(provider => provider.type === 'URL');
    const sdkProviders = providers.filter(provider => provider.type === 'SDK');
    console.log('URL Providers:', urlProviders);

    async function findUrlApiKeys(providerList) {
        let URLproviders = [];
        for (let provider of providerList) {
            if (provider.currentPointer < provider.apiKeys.length) {
                const apiKey = provider.apiKeys[provider.currentPointer]; 
                const providerName = provider.providerName;
                provider.currentPointer = (provider.currentPointer + 1) % provider.apiKeys.length;
                await updateCurrentPointer(provider._id, provider.currentPointer);
                URLproviders.push({ providerName, apiKey });
            }
        }
        return URLproviders;
    }
    
    async function findSdkApiKey(providerList) {
        for (let provider of providerList) {
            if (provider.currentPointer < provider.apiKeys.length) {
                const apiKey = provider.apiKeys[provider.currentPointer];
                const providerName = provider.providerName;
                provider.currentPointer = (provider.currentPointer + 1) % provider.apiKeys.length;
                await updateCurrentPointer(provider._id, provider.currentPointer);
                return { providerName, apiKey }; // Return the first valid SDK provider
            }
        }
        return null;
    }

    let URLproviderConfig = await findUrlApiKeys(urlProviders);
    console.log('URLproviderConfig:', URLproviderConfig);
    if (URLproviderConfig) {
        return URLproviderConfig;
    }

    SDKproviderConfig = await findSdkApiKey(sdkProviders);
    if (SDKproviderConfig) {
        return SDKproviderConfig;
    }

    throw new Error("All API keys exhausted across all providers");
}


const getNormalTransactions = async (req, res) => {
    try {
        const { address } = req.params;
        console.log(`Fetching normal transactions for address: ${address}`);

        let providerConfig;
        let response;

        try {
            providerConfig = await getNextValidApiKey();
            if (!providerConfig) {
                throw new Error("No valid API keys available.");
            }
            response = await normalTransactions(address, providerConfig);
        } catch (error) {
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
