const {getWalletTransactions} =require('../../services/blockchain/Ethereum/transaction');
const {processGraphData}= require('../../serializers/processGraphdata')

const {
    BATCH_DELAY,
    MIN_BTC_VALUE,
    SATOSHI_PER_BITCOIN,
  } = require("../../constants");
  const { aggregateTransactions } = require('../../services/common/aggregationService');
  const {identifyEVMchain} = require('../../utils/identifyBlockchain')
  
  const MAX_LAYERS = 2;
  const MAX_TRANSACTIONS = 100;
  const THRESHOLD = 1;

const getTransactions =async(req,res)=>{
    try{
        const {address, chain} = req.params;
        console.log("gettransaction");
        console.log("pramath")
        let formattedChain = chain.toUpperCase();
        
        const transactions = await getWalletTransactions(address, formattedChain);
        const aggregatedTransactions = aggregateTransactions(transactions, address);
        const graphData = processGraphData(transactions,0, address, formattedChain);
        console.log(transactions)
        res.json({
            results: {
              transactions: transactions,
                aggregatedTransactions: aggregatedTransactions,
                graphdata: graphData
            }
        });
}
    catch(e){
        console.error(e);
        res.status(500).send({error:"An error occurred while fetching transactions"});
    }
}
const getOutgoingTransactions =async(req,res)=>{
    try{
        const {address, chain} = req.params;
        let formattedChain = chain.toUpperCase();
        
        const transactions = await getWalletTransactions(address, formattedChain);
        const aggregatedTransactions = aggregateTransactions(transactions, address);
        const outgoingTransactions = transactions.filter(tx => tx.from_address === address);
        const graphData = processGraphData(outgoingTransactions,0, address, formattedChain);
        res.json({
            results: {
                transactions: transactions,
                aggregateTransactions: aggregatedTransactions,
                graphdata: graphData
            }
        });
}
    catch(e){
        console.error(e);
        res.status(500).send({error:"An error occurred while fetching transactions"});
    }
}

  
async function getAllTransactionsControllers(req, res) {
    const rootAddress = req.params.address;
    const chain = req.params.chain;
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
      console.time('processAddressLayer');
      const processedAddresses = new Set();
      await processAddressLayer(rootAddress, 0, MAX_LAYERS, processedAddresses, sendSSE, formattedChain);
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
    sendSSE,
    formattedChain
  ) {
    if (currentLayer >= maxLayers || processedAddresses.has(address)) {
      return;
    }
  
    processedAddresses.add(address);   // add to maintain a set of processed addresses
  
    sendSSE({
      type: "info",
      message: `Processing layer ${currentLayer + 1}, address: ${address}`,
    });
  
    let cursor = null;
    let totalTransactions = 0;
    const uniqueAddresses = new Set();
  
    while (totalTransactions < MAX_TRANSACTIONS) {
      const transactions = await getWalletTransactions(address, cursor, formattedChain);
      if (transactions.length === 0) break;
  
      const transformedTransactions = transactions
      const aggregatedTransactions = aggregateTransactions(transformedTransactions, address);
      const graphData = processGraphData(aggregatedTransactions, THRESHOLD, address, formattedChain);
      console.log(aggregatedTransactions);
  
      const filteredTransactions = transformedTransactions   // remove this logic put it in aggregationService and do filtering and sorting in aggregationService
        .filter((tx) => {
          const value = parseInt(tx.value) / SATOSHI_PER_BITCOIN;
          return value >= MIN_BTC_VALUE;
        })
        .sort((a, b) => parseInt(b.value) - parseInt(a.value));
  
      totalTransactions += filteredTransactions.length;
  
      sendSSE({
        type: "transactions",
        layerNumber: currentLayer + 1,
        address: address,
        transactions: filteredTransactions,
        aggregateTransactions: aggregatedTransactions,
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
      const transactions = await getWalletTransactions(address);
      const transformedTransactions = transactions
      const aggregatedTransactions = aggregateTransactions(transformedTransactions, address);
      const graphData = processGraphData(aggregatedTransactions, 1, address, formattedChain);
      const filteredTransactions = transformedTransactions
        .filter((tx) => {
          const btcValue = parseInt(tx.value) / SATOSHI_PER_BITCOIN;
          return btcValue >= MIN_BTC_VALUE;
        })
        .sort((a, b) => parseInt(b.value) - parseInt(a.value));
  
      sendSSE({
        type: "transactions",
        layerNumber: currentLayer + 1,
        address: address,
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
  
module.exports = {getTransactions, getAllTransactionsControllers, getOutgoingTransactions};