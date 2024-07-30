const {
  getWalletTransactions,
} = require("../../services/blockchain/Ethereum/transaction");
const { processGraphData } = require("../../serializers/processGraphdata");

const { BATCH_DELAY, CHAIN_UNITS } = require("../../constants");
const {
  aggregateTransactions,
} = require("../../services/common/aggregationService");
const { identifyEVMchain } = require("../../utils/identifyBlockchain");

const MAX_LAYERS = 5;
const MAX_TRANSACTIONS = 100;
const THRESHOLD = 1;

const getTransactions = async (req, res) => {
  try {
    const { address, chain } = req.params;
    let formattedChain = chain.toUpperCase();
    console.log("formattedChain", formattedChain);
    let cursor = null;
    const transactions = await getWalletTransactions(
      address,
      cursor,
      formattedChain
    );
    const aggregatedTransactions = aggregateTransactions(transactions.slice(0,-1), address);
    const graphData = processGraphData(transactions.slice(0,-1), address, formattedChain);
    res.json({
      results: {
        transactions: transactions,
        aggregatedTransactions: aggregatedTransactions,
        graphdata: graphData,
      },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ error: "An error occurred while fetching transactions" });
  }
};
const getOutgoingTransactions = async (req, res) => {
  try {
    const { address, chain } = req.params;
    let formattedChain = chain.toUpperCase();

    const transactions = await getWalletTransactions(
      address,
      cursor,
      formattedChain
    );
    const aggregatedTransactions = aggregateTransactions(transactions.slice(0,-1), address);
    const outgoingTransactions = transactions.filter(
      (tx) => tx.from_address === address
    );
    const graphData = processGraphData(
      outgoingTransactions,
      address,
      formattedChain
    );
    res.json({
      results: {
        transactions: transactions,
        aggregateTransactions: aggregatedTransactions,
        graphdata: graphData,
      },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ error: "An error occurred while fetching transactions" });
  }
};

async function getAllTransactionsControllers(req, res) {
  const rootAddress = req.params.address;
  const chain = req.params.chain;
  console.log("chain", chain);
  let formattedChain = chain.toUpperCase();

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
    console.time("processAddressLayer");
    const processedAddresses = new Set();
    await processAddressLayer(
      rootAddress,
      0,
      MAX_LAYERS,
      processedAddresses,
      sendSSE,
      formattedChain
    );
    console.timeEnd("processAddressLayer");
    console.log("Processing completed, sending close event");

    sendSSE({ type: "close", message: "Stream completed" });
  } catch (error) {
    console.error(error);
    console.error("Error in getAllTransactionsControllers:", error);

    sendSSE({ type: "error", message: "Internal Server Error" });
  } finally {
    console.log("Ending response");
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
  sendSSE,
  formattedChain
) {
  if (currentLayer >= maxLayers || processedAddresses.has(address)) {
    return;
  }
  console.log("formattedChain", formattedChain);
  processedAddresses.add(address); // add to maintain a set of processed addresses

  sendSSE({
    type: "info",
    message: `Processing layer ${currentLayer + 1}, address: ${address}`,
  });

  let cursor = null;
  let totalTransactions = 0;
  const uniqueAddresses = new Set();

  while (totalTransactions < MAX_TRANSACTIONS) {
    const transactions = await getWalletTransactions(
      address,
      cursor,
      formattedChain
    );
    if (transactions.length === 0) break;

    const chain = formattedChain.toLowerCase();
    const minValueKey = `MIN_${chain.toUpperCase()}_VALUE`;

    const transformedTransactions = transactions.slice(0,-1);
    const aggregatedTransactions = aggregateTransactions(
      transformedTransactions,
      address
    );

    const filteredTransactions = aggregatedTransactions.filter((tx) => {

      return tx.value >= CHAIN_UNITS[chain][minValueKey] ;
    });
    console.log('filteredTransactions', filteredTransactions);
    const graphData = processGraphData(
      filteredTransactions,
      address,
      formattedChain
    );
console.log('graphData', graphData);
    totalTransactions += transactions.length;

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

    filteredTransactions.forEach((tx) => {
      if (tx.from_address !== address) uniqueAddresses.add(tx.from_address);
      if (tx.to_address !== address) uniqueAddresses.add(tx.to_address);
    });
    cursor = transactions[transactions.length - 1].cursor;

    if (cursor === null) {
      console.log("No more transactions to fetch, stopping.");
      break;
    }
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
      sendSSE,
      formattedChain
    );
  }
}

async function processNextLayer(
  addresses,
  currentLayer,
  maxLayers,
  processedAddresses,
  sendSSE,
  formattedChain
) {
  const addressesToProcess = addresses.filter(
    (addr) => !processedAddresses.has(addr)
  );

  const processAddress = async (address) => {
    const transactions = await getWalletTransactions(
      address,
      cursor = null,
      formattedChain
    );
    const transformedTransactions = transactions.slice(0,-1);
    const aggregatedTransactions = aggregateTransactions(
      transformedTransactions,
      address
    );
    const chain = formattedChain.toLowerCase();
    const minValueKey = `MIN_${chain.toUpperCase()}_VALUE`;
    const filteredTransactions = aggregatedTransactions.filter((tx) => {
      return tx.value >= CHAIN_UNITS[chain][minValueKey] ;
    });
    const graphData = processGraphData(
      filteredTransactions,
      address,
      formattedChain
    );
console.log('graphData', graphData);
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
      sendSSE,
      formattedChain
    );
  }
}

module.exports = {
  getTransactions,
  getAllTransactionsControllers,
  getOutgoingTransactions,
};
