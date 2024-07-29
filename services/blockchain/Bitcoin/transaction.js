const axios = require("axios");
const {
  transformBitcoinTransaction,
} = require("../../../serializers/btcSerializer");
const {processGraphData} =  require('../../../serializers/processGraphdata')
const {aggregateTransactions} = require('../../common/aggregationService');

async function fetchTransactions(address, lastSeenTxId = null) {
  let allTransactions = [];
  try {
    let response;
    response = await axios.get(
      `https://btcscan.org/api/address/${address}/txs/chain`
    );
    allTransactions = response.data || [];
    return allTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return "error";
  }
}

async function getAllTransactionsController(req, res) {
  try {
    const address = req.params.address;
    console.log("Address:", address);
    const transactions = await fetchTransactions(address);
    if (transactions === "error") {
      return res.status(500).json({ error: "Internal Server Error" });
    }


    // Convert the map to arrays for the API response
    const rawTransactions = transactions.flatMap(tx => transformBitcoinTransaction(tx, address));
    console.log("Raw Transactions:", rawTransactions);
    const aggregatedTransactions = aggregateTransactions(rawTransactions, address);

    console.log("Aggregated Transactions:", aggregatedTransactions);
    const filteredTransactions = aggregatedTransactions.filter((tx)=> tx.value >= 0.01).sort((a, b) => b.value - a.value);
    const graphData = processGraphData(filteredTransactions, address, "BTC");
    console.log("Graph Data:", graphData);
    res.status(200).json({
      results: {
          transactions: rawTransactions,
          aggregatedTransactions: aggregatedTransactions,
          graphdata: graphData
      }
  });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllTransactionsController,
};
