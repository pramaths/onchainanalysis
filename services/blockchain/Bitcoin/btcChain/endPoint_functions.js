const {
  getBalanceUrl,
  getNormalTransactionUrl,
  txHash,
} = require("./queryParams");
const { btcscan, blockstream } = require("./baseUrl");
const {
  transformBitcoinTransaction,
} = require("../../../../serializers/btcSerializer");
const axios = require("axios");
const {
  BATCH_SIZE,
  BATCH_DELAY,
  MIN_BTC_VALUE,
} = require("../../../../constants");

const getBalance = async (address) => {
  try {
    const response = await axios.get(`${btcscan}${getBalanceUrl(address)}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching balance", error);
    return null;
  }
};

async function getAllTransactionsControllers(req, res) {
  const address = req.params.address;
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let lastSeenTxId = null;
  let batchCount = 0;
  let totalTransactions = 0;

  const sendSSE = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendSSE({ type: "info", message: "Starting transaction stream..." });

  try {
    while (true) {
      const startTime = Date.now();
      sendSSE({
        type: "progress",
        message: `Fetching batch ${batchCount + 1}...`,
      });

      const transactions = await getNormalTransactions(
        address,
        lastSeenTxId,
        BATCH_SIZE
      );

      if (transactions.length === 0) {
        sendSSE({ type: "info", message: "All transactions processed." });
        break;
      }

      let transformedTransactions = [];
      transactions.forEach((tx) => {
        const transformedTx = transformBitcoinTransaction(tx, address);
        transformedTransactions = transformedTransactions.concat(transformedTx);
      });

      // Filter transactions with value >= 0.1 BTC
      const filteredTransactions = transformedTransactions.filter((tx) => {
        const btcValue = parseInt(tx.value) / 100000000; // Convert satoshis to BTC
        return btcValue >= MIN_BTC_VALUE;
      });

      // Sort transactions by value (highest first)
      filteredTransactions.sort(
        (a, b) => parseInt(b.value) - parseInt(a.value)
      );

      totalTransactions += filteredTransactions.length;

      sendSSE({
        type: "transactions",
        transactions: filteredTransactions,
        batchNumber: batchCount + 1,
        batchSize: filteredTransactions.length,
        totalProcessed: totalTransactions,
        timestamp: new Date().toISOString(),
      });

      lastSeenTxId = transactions[transactions.length - 1].txid;
      batchCount++;

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      sendSSE({
        type: "stats",
        batchNumber: batchCount,
        processingTime: processingTime,
        totalProcessed: totalTransactions,
      });

      // Add delay between batches
      const remainingDelay = BATCH_DELAY - processingTime;
      if (remainingDelay > 0) {
        sendSSE({
          type: "info",
          message: `Waiting for ${remainingDelay}ms before next batch...`,
        });
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }
    }

    sendSSE({ type: "info", message: "Stream ended." });
    res.end();
  } catch (error) {
    console.error(error);
    sendSSE({ type: "error", message: "Internal Server Error" });
    res.end();
  }
}

const getNormalTransactions = async (
  address,
  lastSeenTxId = null,
  limit = 50
) => {
  try {
    let url;
    if (lastSeenTxId) {
      url = `${btcscan}${getNormalTransactionUrl(address, lastSeenTxId)}`;
    } else {
      url = `${btcscan}${getNormalTransactionUrl(address)}`;
    }

    url += `&limit=${limit}`;

    const response = await axios.get(url);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }
};

const fetchTransactionDetails = async (txhash) => {
  const url = `${btcscan}${txHash(txhash)}`;
  console.log("URL:", url); 
  let address = "";
  try {
    const response = await axios.get(url);
    if(response.data.vin && response.data.vin.length > 0){
      if(response.data.vin[0].prevout && response.data.vin[0].prevout.scriptpubkey_address){
        address = response.data.vin[0].prevout.scriptpubkey_address;
      }
    }
    if(!response.data.vin){
      if(response.data.prevout && response.data.prevout.scriptpubkey_address){
        address = response.data.prevout.scriptpubkey_address;
      }
    }
    const formattedResponse = transformBitcoinTransaction(response.data, address);
    return formattedResponse;
  } catch (error) {
    console.error("Error in fetching transaction details", error);
    throw new Error("Failed to fetch transaction details");
  }
};

module.exports = {
  getBalance,
  getNormalTransactions,
  getAllTransactionsControllers,
  fetchTransactionDetails,
};
