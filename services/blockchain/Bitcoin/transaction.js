const axios = require("axios");
const {
  transformBitcoinTransaction,
} = require("../../../serializers/btcSerializer");
const {processGraphData} =  require('../../../serializers/processGraphdata')

async function fetchTransactions(address, lastSeenTxId = null) {
  let allTransactions = [];
  try {
    let response;
    // if (lastSeenTxId) {
    //   response = await axios.get(
    //     `https://btcscan.org/api/address/${address}/txs/chain/${lastSeenTxId}`
    //   );
    // } else {
    response = await axios.get(
      `https://btcscan.org/api/address/${address}/txs/chain`
    );
    // }

    const chunkTransactions = response.data || [];
    allTransactions = allTransactions.concat(chunkTransactions);

    const lastTxId =
      chunkTransactions.length > 0
        ? chunkTransactions[chunkTransactions.length - 1].txid
        : null;
    if (lastTxId && lastTxId !== lastSeenTxId) {
      const moreTransactions = await fetchTransactions(address, lastTxId);
      allTransactions = allTransactions.concat(moreTransactions);
    }
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
    console.log("Transactions:", transactions);
    if (transactions === "error") {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let transformedTransactions = [];
    let transactionMap =new Map();
    
    transactions.forEach((tx) => {
      const transformedTxs = transformBitcoinTransaction(tx, address);
      transformedTransactions.push(...transformedTxs); // Collect all transformed transactions
      transformedTxs.forEach(transformedTx => {
        if (transactionMap.has(transformedTx.address)) {
          // If the address is already present, sum the values
          const existingTx = transactionMap.get(transformedTx.address);
          existingTx.value += transformedTx.value; // Assuming 'value' is a field to aggregate
          transactionMap.set(transformedTx.address, existingTx);
        } else {
          // If the address is not present, add it to the map
          transactionMap.set(transformedTx.address, transformedTx);
        }
      });
    });

    const aggregatedTransactions = Array.from(transactionMap.values());

    graphData = processGraphData(aggregatedTransactions, 0.1, address, "BTC");

    res.status(200).json({
      results: {
          transactions: transformedTransactions,
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
