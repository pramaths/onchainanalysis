const axios = require('axios');

async function fetchTransactions(address, lastSeenTxId = null) {
    let allTransactions = [];
    try {
        let response;
        if (lastSeenTxId) {
            response = await axios.get(`https://btcscan.org/api/address/${address}/txs/chain/${lastSeenTxId}`);
        } else {
            response = await axios.get(`https://btcscan.org/api/address/${address}/txs/chain`);
        }

        const chunkTransactions = response.data || [];
        allTransactions = allTransactions.concat(chunkTransactions);

        const lastTxId = chunkTransactions.length > 0 ? chunkTransactions[chunkTransactions.length - 1].txid : null;
        if (lastTxId && lastTxId !== lastSeenTxId) {
            // Recursively fetch more transactions and concatenate them.
            const moreTransactions = await fetchTransactions(address, lastTxId);
            allTransactions = allTransactions.concat(moreTransactions);
        }
        return allTransactions;
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        return 'error';
    }
}

async function getAllTransactionsController(req, res) {
    try {
        const address = req.params.address;
        const transactions = await fetchTransactions(address);
        
        // Check if an error occurred during the recursive fetching
        if (transactions === 'error') {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllTransactionsController
};
