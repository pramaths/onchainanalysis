const axios = require('axios');

function transformBitcoinTransaction(transaction, address) {
    let totalSent = 0;
    let totalReceived = 0;
    inflow = []
    console.log(transaction.txid);
    transaction.vin.forEach(input => {
        if (input.prevout && input.prevout.scriptpubkey_address != address) {
            totalSent += input.prevout.value;
            inflow.push({from_address :input.prevout.scriptpubkey_address,to_address:address, value: input.prevout.value});
        }
    });
    outflow = []
    let changeReturned = 0;
    transaction.vout.forEach(output => {
        if (output.scriptpubkey_address === address) {
            totalReceived += output.value;
        }
        if (output.scriptpubkey_address === address && transaction.vin.some(input => input.prevout.scriptpubkey_address === address)) {
            changeReturned += output.value;
            outflow.push({ to_address: output.scriptpubkey_address, from_address:address, value: output.value })
        }
    });

    const actualSent = totalSent - changeReturned;
    const netValue = totalReceived - actualSent - transaction.fee;

    return {
        txid: transaction.txid,
        inflow: inflow,
        outflow:outflow,
        // confirmed: transaction.status.confirmed,
        // block_height: transaction.status.block_height,
        // block_hash: transaction.status.block_hash,
        block_time: transaction.status.block_time,
    };
}


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
        if (transactions === 'error') {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const transformedTransactions = transactions.map(tx => transformBitcoinTransaction(tx, address));
        res.status(200).json({ result:transformedTransactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllTransactionsController
};
