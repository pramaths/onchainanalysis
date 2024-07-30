const { fetchTransactionDetails } = require('../../services/blockchain/Bitcoin/btcChain/endPoint_functions');
const { processGraphData } = require("../../serializers/processGraphdata");


const getTxHashDetails = async (req, res) => {
  const txhash = req.params.txhash;
  
  try {
    const transactionDetails = await fetchTransactionDetails(txhash);
    const processGraphData = processGraphData(transactionDetails, transactionDetails[0].from_address, "BTC");
    res.json({
      results: {
        transaction: transactionDetails,
        graphdata: processGraphData,
      },
    });
  } catch (error) {
    console.error("Error in controller:", error.message);
    res.status(500).send("Error in fetching transaction details");
  }
};

module.exports = { getTxHashDetails };
