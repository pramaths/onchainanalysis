const axios = require('axios');

async function fetchTransactions(address, res, lastSeenTxId = null) {
    let allTransactions = [];
    try {
        let response;
        console.log(lastSeenTxId)
        if (lastSeenTxId) {
            response = await axios.get(`https://btcscan.org/api/address/${address}/txs/chain/${lastSeenTxId}`);
        } else {
            response = await axios.get(`https://btcscan.org/api/address/${address}/txs/chain`);
        }

        const chunkTransactions = response.data || [];
        allTransactions = allTransactions.concat(chunkTransactions);
        res.write(JSON.stringify(chunkTransactions));
        const lastTxId = chunkTransactions.length > 0 ? chunkTransactions[chunkTransactions.length - 1].txid : null;
        if (lastTxId && lastTxId !== lastSeenTxId) {
            // Recursively fetch more transactions
            await fetchTransactions(address, res, lastTxId);
        } else {
            res.end();
        }
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllTransactionsController(req, res) {
    try {
        const address = req.params.address;
        console.log(address)
        await fetchTransactions(address, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllTransactionsController
};
