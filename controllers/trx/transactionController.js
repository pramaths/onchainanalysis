const {getNormalTransactions} = require("../../services/blockchain/Tron/endpoint_functions");


const {tronChainSerializer} = require("../../serializers/tronSerializer");

const getAllTransactionsControllers = async (req, res) => {
    const address = req.params.address;
    try{
    const transactions = await getNormalTransactions(address);
    const formattedData = tronChainSerializer(transactions);
    res.status(200).send(formattedData);
    }
    catch(e){
        console.log(e);
    }
}

const getOutgoingTransactions = async (req, res) => {
    const address = req.params.address;
    const transactions = await getNormalTransactions(address);
    const outgoingTransactions = transactions.filter(tx => tx.from === address);
    const formattedData = tronChainSerializer(outgoingTransactions);
    res.json(formattedData);
}

module.exports = {getAllTransactionsControllers, getOutgoingTransactions};

