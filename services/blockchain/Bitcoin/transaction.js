const axios = require("axios");

function transformBitcoinTransaction(transaction, address) {
  const transactions = [];

  if (!transaction.vin) {
    if (transaction.prevout.scriptpubkey_address !== address) {
      console.log("No vin found in transaction:", transaction.txid);
      const tx = {
        block_hash: transaction.block_hash || "",
        block_number: transaction.block_no || "",
        block_timestamp: transaction.block_timestamp
          ? new Date(transaction.block_timestamp).toISOString()
          : "",
        from_address: transaction.prevout.scriptpubkey_address,
        to_address: address,
        value: transaction.vout[0].value || "",
        txid: transaction.txid || "",
        block_time: transaction.status.block_time || "",
      };
      console.log("+++", tx);
      transactions.push(tx);
    }
  }
  if (transaction.vin && transaction.vin.length > 0) {
    transaction.vin.forEach((input) => {
      if (input.prevout && input.prevout.scriptpubkey_address !== address) {
        const tx = {
          block_hash: transaction.block_hash || "",
          block_number: transaction.block_no || "",
          block_timestamp: transaction.block_timestamp
            ? new Date(transaction.block_timestamp).toISOString()
            : "",
          from_address: input.prevout.scriptpubkey_address  || "pramath",
          to_address: address ,
          value: input.prevout.value || "",
          txid: transaction.txid || "",
          block_time: transaction.status.block_time || "",
        };
        transactions.push(tx);
      }
    });
  }

  transaction.vout.forEach((output) => {
    if (
      output.scriptpubkey_address !== address

    ) {
      const tx = {
        block_hash: transaction.block_hash || "",
        block_number: transaction.block_no || "",
        block_timestamp: transaction.block_timestamp
          ? new Date(transaction.block_timestamp).toISOString()
          : "",
        from_address: address,
        to_address: output.scriptpubkey_address || "pramath",
        value: output.value,
        txid: transaction.txid || "",
        block_time: transaction.status.block_time || "",
      };
      transactions.push(tx);
    }
  });
  console.log("___", transactions);
  return transactions;
}

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
      // Recursively fetch more transactions and concatenate them.
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
  transformBitcoinTransaction,
};
