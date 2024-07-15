const { fetchTransactionDetails } = require('../../services/blockchain/Bitcoin/btcChain/endPoint_functions');

const getTxHashDetails = async (req, res) => {
  const txhash = req.params.txhash;
  
  try {
    const transactionDetails = await fetchTransactionDetails(txhash);
    res.send(transactionDetails);
  } catch (error) {
    console.error("Error in controller:", error.message);
    res.status(500).send("Error in fetching transaction details");
  }
};

module.exports = { getTxHashDetails };
