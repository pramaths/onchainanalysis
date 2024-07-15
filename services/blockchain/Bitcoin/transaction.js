const axios = require("axios");
const {
  transformBitcoinTransaction,
} = require("../../../serializers/btcSerializer");

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
    const transactions = await fetchTransactions(address);
    if (transactions === "error") {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let transformedTransactions = [];
    transactions.forEach((tx) => {
      const transformedTx = transformBitcoinTransaction(tx, address);
      if (transformedTx.length > 0) {
        transformedTransactions = transformedTransactions.concat(transformedTx);
      }
    });

    res.status(200).json({ result: transformedTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllTransactionsController,
};
