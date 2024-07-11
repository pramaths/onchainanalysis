const mongoose = require('mongoose');
const { normalTransactions } = require('./endpoint_functions');
const Provider = require('../../../../models/providers');

async function getNextValidApiKey() {
    const etherscanProvider = await Provider.findOne({ name: 'ETHERSCAN' });
    console.log(etherscanProvider);
    if (etherscanProvider && etherscanProvider.currentPointer < etherscanProvider.apiKeys.length) {
        const apiKey = etherscanProvider.apiKeys[etherscanProvider.currentPointer];
        etherscanProvider.currentPointer = (etherscanProvider.currentPointer + 1) % etherscanProvider.apiKeys.length;
        await etherscanProvider.save();
        console.log(`Using Etherscan API key: ${apiKey}`);
        console.log(`Current pointer for Etherscan: ${etherscanProvider.currentPointer}`);
        return { apiKey, providerName: etherscanProvider.name };
    }

    const providers = await Provider.find({ name: { $ne: 'Etherscan' } }).sort('name');
    for (let provider of providers) {
        if (provider.currentPointer < provider.apiKeys.length) {
            const apiKey = provider.apiKeys[provider.currentPointer];
            provider.currentPointer = (provider.currentPointer + 1) % provider.apiKeys.length;
            await provider.save();
            return { apiKey, providerName: provider.name };
        }
    }

    throw new Error("All API keys exhausted across all providers");
}

const getNormalTransactions = async (req, res) => {
    try {
        const { address } = req.params;
        console.log(`Fetching normal transactions for address: ${address}`);

        let apiKeyInfo;
        let response;
        let attempts = 0;
        const maxAttempts = 1; 

        while (attempts < maxAttempts) {
            try {
                apiKeyInfo = await getNextValidApiKey();
                console.log(`Using provider: ${apiKeyInfo.providerName}`);
                console.log(`Using API key: ${apiKeyInfo.apiKey}`);
                response = await normalTransactions(address, apiKeyInfo.apiKey);
                break; 
            } catch (error) {
                console.error(`Attempt ${attempts + 1} failed with provider ${apiKeyInfo.providerName}:`, error.message);
                attempts++;
                if (attempts >= maxAttempts) {
                    throw new Error("Max attempts reached. Unable to fetch normal transactions.");
                }
            }
        }
        res.json({
            ...response,
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred while fetching normal transactions");
    }
}

module.exports = { getNormalTransactions };
