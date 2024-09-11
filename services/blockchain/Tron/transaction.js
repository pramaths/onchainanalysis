const {getAccountBalance, getNormalTransactions, getTransactionInfo} = require('./endpoint_functions');


const getAllTransactionsController = async (req, res) => {
    const address = req.params.address;
    console.log("AAA",address);
    const transactions = await getNormalTransactions(address);
    res.json(transactions);
}

module.exports = {getAllTransactionsController};