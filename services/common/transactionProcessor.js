const { getTransactions } = require('./blockchainService');
const { transformBitcoinTransaction } = require("../../serializers/btcSerializer");
const { processGraphData } = require('../../serializers/processGraphdata');
const { aggregateTransactions } = require('../../services/aggregationService');
const { delay, filterAndSortTransactions } = require('./utils');

const processAddressLayer = async (address, currentLayer, maxLayers, processedAddresses, sendSSE, chain) => {
  if (currentLayer >= maxLayers || processedAddresses.has(address)) return;

  processedAddresses.add(address);
  sendSSE({ type: "info", message: `Processing layer ${currentLayer + 1}, address: ${address}` });

  let lastSeenTxId = null;
  let totalTransactions = 0;
  const uniqueAddresses = new Set();

  while (totalTransactions < 100) {
    const transactions = await getTransactions(address, lastSeenTxId);
    if (transactions.length === 0) break;

    const transformedTransactions = transactions.flatMap(tx => transformBitcoinTransaction(tx, address));
    const aggregatedTransactions = aggregateTransactions(transformedTransactions, address);
    const graphData = processGraphData(aggregatedTransactions, 0, address, chain);

    const filteredTransactions = filterAndSortTransactions(transformedTransactions, address);

    totalTransactions += filteredTransactions.length;

    sendSSE({
      type: "transactions",
      layerNumber: currentLayer + 1,
      address,
      transactions: filteredTransactions,
      aggregateTransactions: aggregatedTransactions,
      graphdata: graphData,
      totalProcessed: totalTransactions,
      timestamp: new Date().toISOString(),
    });

    filteredTransactions.forEach(tx => {
      if (tx.from_address !== address) uniqueAddresses.add(tx.from_address);
      if (tx.to_address !== address) uniqueAddresses.add(tx.to_address);
    });

    lastSeenTxId = transactions[transactions.length - 1].txid;

    await delay(BATCH_DELAY);
  }

  if (currentLayer < maxLayers - 1) {
    const nextLayerAddresses = Array.from(uniqueAddresses).slice(0, 10);
    await processNextLayer(nextLayerAddresses, currentLayer + 1, maxLayers, processedAddresses, sendSSE);
  }
};

const processNextLayer = async (addresses, currentLayer, maxLayers, processedAddresses, sendSSE , chain) => {
  const addressesToProcess = addresses.filter(addr => !processedAddresses.has(addr));

  const results = await Promise.all(addressesToProcess.map(async (address) => {
    const transactions = await getTransactions(address);
    const transformedTransactions = transactions.flatMap(tx => transformBitcoinTransaction(tx, address));
    const aggregatedTransactions = aggregateTransactions(transformedTransactions, address);
    const graphData = processGraphData(aggregatedTransactions, 1, address, chain);
    const filteredTransactions = filterAndSortTransactions(transformedTransactions, address);

    sendSSE({
      type: "transactions",
      layerNumber: currentLayer + 1,
      address,
      transactions: filteredTransactions,
      aggregateTransactions: aggregatedTransactions,
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
  }));

  const nextLayerAddresses = Array.from(new Set(results.flatMap(set => Array.from(set)))).slice(0, 2);

  if (currentLayer < maxLayers - 1) {
    await processNextLayer(nextLayerAddresses, currentLayer + 1, maxLayers, processedAddresses, sendSSE);
  }
};

module.exports = {
  processAddressLayer,
  processNextLayer,
};
