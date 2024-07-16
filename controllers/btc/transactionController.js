const {BATCH_DELAY, MIN_BTC_VALUE, WEI_PER_ETHER, SATOSHI_PER_BITCOIN} = require('../../constants');
const {  getNormalTransactions } = require("../../services/blockchain/Bitcoin/btcChain/endPoint_functions");


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
          const btcValue = parseInt(tx.value) / SATOSHI_PER_BITCOIN; // Convert satoshis to BTC
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


  module.exports = { getAllTransactionsControllers };