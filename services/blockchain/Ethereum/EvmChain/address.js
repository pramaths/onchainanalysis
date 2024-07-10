const mongoose = require('mongoose');
const { balance } = require('./endpoint_functions');
const ApiKey = mongoose.model('API_KEYS', new mongoose.Schema({}, { strict: false }), 'API_KEYS');

const getBalance = async (req, res) => {
    try {
        const { address } = req.params;
        const apiKeyDoc = await ApiKey.findOne();
        console.log(address);
        if (!apiKeyDoc) {
            return res.status(404).send("API Key not found");
        }
        console.log(apiKeyDoc);
        const api_key = apiKeyDoc.api_key;
        const response = await balance(address,api_key);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred while fetching balance");
    }
}


module.exports = { getBalance };