const { balance } = require('./endpoint_functions');
const { fetchAndSortProviders, updateCurrentPointer } = require('../../../../db/providerService');
const logger = require('../../../../utils/logger');

async function getNextValidApiKey() {
    const providers = await fetchAndSortProviders();
    const urlProviders = providers.filter(provider => provider.type === 'URL');
    const sdkProviders = providers.filter(provider => provider.type === 'SDK');

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
                return { providerName, apiKey };
            }
        }
        return null;
    }

    const URLproviderConfig = await findUrlApiKeys(urlProviders);
    if (URLproviderConfig.length) return URLproviderConfig;
    const SDKproviderConfig = await findSdkApiKey(sdkProviders);
    if (SDKproviderConfig) return SDKproviderConfig;

    throw new Error("All API keys exhausted across all providers");
}

const getEthBalance = async (req, res) => {
    try {
        const { address } = req.params;
        console.log(`Fetching balance for address: ${address}`);

        const providerConfig = await getNextValidApiKey();
        if (!providerConfig) {
            throw new Error("No valid API keys available.");
        }

        const responses = await balance(address, providerConfig);
        let totalBalance = responses.reduce((acc, provider) => {
            if (provider.data && provider.data.status === "1" && provider.data.message === "OK") {
                const balance = parseFloat(provider.data.result) / 10e18;  // Convert wei to Ether
                acc += balance;
            }
            return acc;
        }, 0);

        const formattedResponses = responses.map(provider => {
            if (provider.data && provider.data.status === "1" && provider.data.message === "OK") {
                const balance = parseFloat(provider.data.result) / 10e18;  // Convert wei to Ether
                return {
                    providerName: provider.providerName,
                    balance: balance,
                    percentage: (balance / totalBalance) * 100  // Calculate percentage
                };
            } else {
                return {
                    providerName: provider.providerName,
                    error: provider.error,
                    message: provider.message,
                    percentage: 0
                };
            }
        });

        const summary = {
            totalSuccessful: formattedResponses.filter(resp => !resp.error).length,
            totalBalance: totalBalance,
            responses: formattedResponses
        };

        res.json(summary);
    } catch (error) {
        console.log(`Operation failed: ${error.message}`);
        res.status(500).send("An error occurred while fetching balance data");
    }
}

module.exports = { getEthBalance };
