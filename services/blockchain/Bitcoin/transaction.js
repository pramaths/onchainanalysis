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

    let transactionMap = new Map();

    transactions.forEach((tx) => {
      const transformedTxs = transformBitcoinTransaction(tx, address);
      transformedTxs.forEach(transformedTx => {
          if (transformedTx.from_address === address && transformedTx.to_address !== address) {
            const existingTx = transactionMap.get(transformedTx.to_address);
              if (existingTx && existingTx.state !== 'received') {
                  
                  existingTx.value += transformedTx.value; 
                  existingTx.state = 'sent';
                  existingTx.transactions.push({
                      block_timestamp: transformedTx.block_timestamp,
                      value: transformedTx.value
                  });
                  transactionMap.set(transformedTx.to_address, existingTx);
              } else {
                  transactionMap.set(transformedTx.to_address, {
                      to_address: transformedTx.to_address,
                      from_address: address,
                      value: transformedTx.value,
                      state: 'sent',
                      transactions: [{
                          block_timestamp: transformedTx.block_timestamp,
                          value: transformedTx.value
                      }]
                  });
              }
          }
          else if (transformedTx.to_address === address && transformedTx.from_address !== address) {
            const existingTx = transactionMap.get(transformedTx.from_address);
              if (existingTx && existingTx.state !== 'sent') {
                 
                  existingTx.value += transformedTx.value;
                  existingTx.state = 'received';
                  existingTx.transactions.push({
                      block_timestamp: transformedTx.block_timestamp,
                      value: transformedTx.value
                  }); 
                  transactionMap.set(transformedTx.from_address, existingTx);
              } else {
                  transactionMap.set(transformedTx.from_address, {
                      from_address: transformedTx.from_address,
                      to_address: address,
                      value: transformedTx.value,
                      state: 'received',
                      transactions: [{
                          block_timestamp: transformedTx.block_timestamp,
                          value: transformedTx.value
                      }]
                  });
              }
          }
      });
  });

    // Convert the map to arrays for the API response
    const rawTransactions = transactions.flatMap(tx => transformBitcoinTransaction(tx, address));
    console.log("Raw Transactions:", rawTransactions);
    const aggregatedTransactions = Array.from(transactionMap.values());
    console.log("Aggregated Transactions:", aggregatedTransactions);

    graphData = processGraphData(aggregatedTransactions, 0.1, address, "BTC");

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
