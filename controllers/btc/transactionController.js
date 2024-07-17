const { BATCH_DELAY, MIN_BTC_VALUE, SATOSHI_PER_BITCOIN } = require('../../constants');
const { getNormalTransactions } = require("../../services/blockchain/Bitcoin/btcChain/endPoint_functions");
const { transformBitcoinTransaction } = require("../../serializers/btcSerializer");

async function getAllTransactionsControllers(req, res) {
    const rootAddress = req.params.address;
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    const sendSSE = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendSSE({ type: "info", message: "Starting multi-layer transaction stream..." });

    try {
        const processedAddresses = new Set();
        await processAddressLayer(rootAddress, 0, 4, processedAddresses, sendSSE);

        sendSSE({ type: "info", message: "All layers processed." });
        res.end();
    } catch (error) {
        console.error(error);
        sendSSE({ type: "error", message: "Internal Server Error" });
        res.end();
    }
}

async function processAddressLayer(address, currentLayer, maxLayers, processedAddresses, sendSSE) {
    if (currentLayer >= maxLayers || processedAddresses.has(address)) {
        return;
    }

    processedAddresses.add(address);
    sendSSE({ type: "info", message: `Processing layer ${currentLayer + 1}, address: ${address}` });

    let lastSeenTxId = null;
    let totalTransactions = 0;
    const uniqueAddresses = new Set();

    while (totalTransactions < 250) {
        const transactions = await getNormalTransactions(address, lastSeenTxId);
        console.log('====',transactions.length);
        if (transactions.length === 0) break;

        const transformedTransactions = transactions.flatMap(tx => transformBitcoinTransaction(tx, address));
        console.log(transformedTransactions)
        const filteredTransactions = transformedTransactions.filter(tx => {
            const value = parseInt(tx.value) / SATOSHI_PER_BITCOIN;
            return value >= MIN_BTC_VALUE;
        }).sort((a, b) => parseInt(b.value) - parseInt(a.value));

        totalTransactions += filteredTransactions.length;

        sendSSE({
            type: "transactions",
            layerNumber: currentLayer + 1,
            address: address,
            transactions: filteredTransactions,
            totalProcessed: totalTransactions,
            timestamp: new Date().toISOString(),
        });

        filteredTransactions.forEach(tx => {
            if (tx.from_address !== address) uniqueAddresses.add(tx.from_address);
            if (tx.to_address !== address) uniqueAddresses.add(tx.to_address);
        });

        lastSeenTxId = transactions[transactions.length - 1].txid;
        console.log('lastSeenTxId',lastSeenTxId);
        console.log('uniqueAddresses',uniqueAddresses);

        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }

    if (currentLayer < maxLayers - 1) {
        const nextLayerAddresses = Array.from(uniqueAddresses).slice(0, 10);
        await processNextLayer(nextLayerAddresses, currentLayer + 1, maxLayers, processedAddresses, sendSSE);
    }
}

async function processNextLayer(addresses, currentLayer, maxLayers, processedAddresses, sendSSE) {
    const addressesToProcess = addresses.filter(addr => !processedAddresses.has(addr));
    
    const processAddress = async (address) => {
        const transactions = await getNormalTransactions(address);
        const transformedTransactions = transactions.flatMap(tx => transformBitcoinTransaction(tx, address));
        
        const filteredTransactions = transformedTransactions.filter(tx => {
            const btcValue = parseInt(tx.value) / SATOSHI_PER_BITCOIN;
            return btcValue >= MIN_BTC_VALUE;
        }).sort((a, b) => parseInt(b.value) - parseInt(a.value));

        sendSSE({
            type: "transactions",
            layerNumber: currentLayer + 1,
            address: address,
            transactions: filteredTransactions,
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
    
    const nextLayerAddresses = Array.from(new Set(results.flatMap(set => Array.from(set)))).slice(0, 2);
    
    if (currentLayer < maxLayers - 1) {
        await processNextLayer(nextLayerAddresses, currentLayer + 1, maxLayers, processedAddresses, sendSSE);
    }
}

module.exports = { getAllTransactionsControllers };