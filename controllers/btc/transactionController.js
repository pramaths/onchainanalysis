const {
  BATCH_DELAY,
  MIN_BTC_VALUE,
  SATOSHI_PER_BITCOIN,
} = require("../../constants");
const {
  getNormalTransactions,
} = require("../../services/blockchain/Bitcoin/btcChain/endPoint_functions");
const {
  transformBitcoinTransaction,
} = require("../../serializers/btcSerializer");
const { processGraphData } = require('../../serializers/processGraphdata');
const { aggregateTransactions } = require('../../services/common/aggregationService');


const MAX_LAYERS = 2;
const MAX_TRANSACTIONS = 100;

async function getAllTransactionsControllers(req, res) {
  const rootAddress = req.params.address;
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendSSE = (data) => {
    if (data) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  sendSSE({
    type: "info",
    message: "Starting multi-layer transaction stream...",
  });
  

  try {
    console.time('processAddressLayer');
    const processedAddresses = new Set();
    await processAddressLayer(rootAddress, 0, MAX_LAYERS, processedAddresses, sendSSE);
    console.timeEnd('processAddressLayer');
    console.log('Processing completed, sending close event');

    sendSSE({ type: "close", message: "Stream completed" });
  } catch (error) {
    console.error(error);
    console.error('Error in getAllTransactionsControllers:', error);

    sendSSE({ type: "error", message: "Internal Server Error" });
  } finally {
    console.log('Ending response');
    setTimeout(() => {
      res.end();
    }, 10000);
  }
}

async function processAddressLayer(
  address,
  currentLayer,
  maxLayers,
  processedAddresses,
  sendSSE
) {
  if (currentLayer >= maxLayers || processedAddresses.has(address)) {
    return;
  }

  processedAddresses.add(address);   // add to maintain a set of processed addresses

  sendSSE({
    type: "info",
    message: `Processing layer ${currentLayer + 1}, address: ${address}`,
  });

  let lastSeenTxId = null;
  let totalTransactions = 0;
  const uniqueAddresses = new Set();

  while (totalTransactions < MAX_TRANSACTIONS) {
    const transactions = await getNormalTransactions(address, lastSeenTxId);
    if (transactions.length === 0) break;

    const transformedTransactions = transactions.flatMap((tx) =>
      transformBitcoinTransaction(tx, address)
    );
    
    const aggregatedTransactions = aggregateTransactions(transformedTransactions, address);
    const filteredTransactions = aggregatedTransactions   // remove this logic put it in aggregationService and do filtering and sorting in aggregationService
    .filter((tx) => {
      const value = parseInt(tx.value) / SATOSHI_PER_BITCOIN;
      return value >= MIN_BTC_VALUE;
    })
    .sort((a, b) => parseInt(b.value) - parseInt(a.value));
    const graphData = processGraphData(filteredTransactions, address, "BTC");
    console.log(aggregatedTransactions);

    totalTransactions += transactions.length;
      console.log('aggregatedTransactions', aggregatedTransactions);
      console.log('graphData', graphData);
    sendSSE({
      type: "transactions",
      layerNumber: currentLayer + 1,
      address: address,
      transactions: aggregatedTransactions,
      aggregateTransactions: filteredTransactions,
      graphdata: graphData,
      totalProcessed: totalTransactions,
      timestamp: new Date().toISOString(),
    });

    filteredTransactions.forEach((tx) => {             // remove this logic also put it in aggregationService 
      if (tx.from_address !== address) uniqueAddresses.add(tx.from_address);
      if (tx.to_address !== address) uniqueAddresses.add(tx.to_address);
    });

    lastSeenTxId = transactions[transactions.length - 1].txid;
    console.log("lastSeenTxId", lastSeenTxId);
    console.log("uniqueAddresses", uniqueAddresses);

    await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
  }

  if (currentLayer < maxLayers - 1) {
    const nextLayerAddresses = Array.from(uniqueAddresses).slice(0, 10);
    await processNextLayer(
      nextLayerAddresses,
      currentLayer + 1,
      maxLayers,
      processedAddresses,
      sendSSE
    );
  }
}

async function processNextLayer(
  addresses,
  currentLayer,
  maxLayers,
  processedAddresses,
  sendSSE
) {
  const addressesToProcess = addresses.filter(
    (addr) => !processedAddresses.has(addr)
  );

  const processAddress = async (address) => {
    const transactions = await getNormalTransactions(address);
    const transformedTransactions = transactions.flatMap((tx) =>
      transformBitcoinTransaction(tx, address)
    );
    const aggregatedTransactions = aggregateTransactions(transformedTransactions, address);
    const filteredTransactions = aggregatedTransactions   // remove this logic put it in aggregationService and do filtering and sorting in aggregationService
      .filter((tx) => {
        const btcValue = parseInt(tx.value) / SATOSHI_PER_BITCOIN;
        return btcValue >= MIN_BTC_VALUE;
      })
      .sort((a, b) => parseInt(b.value) - parseInt(a.value));
    const graphData = processGraphData(filteredTransactions, address, "BTC");
    

    sendSSE({
      type: "transactions",
      layerNumber: currentLayer + 1,
      address: address,
      transactions: aggregatedTransactions,
      aggregateTransactions: filteredTransactions,
      graphdata: graphData,
      totalProcessed: filteredTransactions.length,
      timestamp: new Date().toISOString(),
    });

    processedAddresses.add(address);

    return filteredTransactions.reduce((acc, tx) => {
      if (tx.from_address !== address) acc.add(tx.from_address);
      if (tx.to_address !== address) acc.add(tx.to_address);
      return acc;
    }, new Set());
  };

  const results = await Promise.all(addressesToProcess.map(processAddress));

  const nextLayerAddresses = Array.from(
    new Set(results.flatMap((set) => Array.from(set)))
  ).slice(0, 2);

  if (currentLayer < maxLayers - 1) {
    await processNextLayer(
      nextLayerAddresses,
      currentLayer + 1,
      maxLayers,
      processedAddresses,
      sendSSE
    );
  }
}

async function getOutgoingTransactions(req, res) {
  const baseAddress = req.params.address;
  
  try {
    let lastSeenTxId = null;
    const outgoingTransactions = [];

    while (true && outgoingTransactions.length < 100) {
      const transactions = await getNormalTransactions(baseAddress, lastSeenTxId);
      if (transactions.length === 0) break;

      const transformedTransactions = transactions.flatMap((tx) =>
        transformBitcoinTransaction(tx, baseAddress)
      );

      const filteredTransactions = transformedTransactions
        .filter((tx) => {
          const value = parseInt(tx.value) / SATOSHI_PER_BITCOIN;
          return value >= MIN_BTC_VALUE && tx.from_address === baseAddress;
        })
        .sort((a, b) => parseInt(b.value) - parseInt(a.value));

      outgoingTransactions.push(...filteredTransactions);

      lastSeenTxId = transactions[transactions.length - 1].txid;
    }

    res.status(200).json({
      address: baseAddress,
      transactions: outgoingTransactions,
      totalProcessed: outgoingTransactions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in getOutgoingTransactions:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = { getAllTransactionsControllers, getOutgoingTransactions};
