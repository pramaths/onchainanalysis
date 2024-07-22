const {getBalance} =require('../../services/blockchain/Bitcoin/btcChain/endPoint_functions');
const {addressSerializer} = require('../../serializers/addressSerializer');

const getDetailsController = async (req, res) => {
    try {
        const { address } = req.params;
        if (!address) {
            return res.status(400).send({ error: "Address is required" });
        }

        const balance = await getBalance(address);
        const formatedData = addressSerializer(balance, 'btc');
        res.json(formatedData);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "An error occurred while fetching balance" });
    }
}

module.exports = { getDetailsController };