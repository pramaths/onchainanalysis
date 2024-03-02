const axios = require('axios');

// Define the API key here
const API_KEY = 'Oxu0AV7QsNfxfix5amPs';
function transformBitcoinTransaction(transaction, address) {
    let inflow = [];
    let outflow = [];
  
    // Check if inputs exist and then process them
    if (transaction.inputs) {
        transaction.inputs.forEach(input => {
            if (input.address !== address) {
                inflow.push({
                    from_address: input.address,
                    to_address: address,
                    value: input.value,
                });
            }
        });
    }
  
    // Check if outputs exist and then process them
    if (transaction.outputs) {
        transaction.outputs.forEach(output => {
            if (output.address === address) {
                outflow.push({
                    from_address: address,
                    to_address: output.address,
                    value: output.value,
                });
            }
        });
    }
  
    return {
        txid: transaction.txid,
        inflow: inflow,
        outflow: outflow,
        block_time: transaction.time,
    };
}


// Function to fetch transactions from the API
async function fetchTransactions(address) {
    try {
        const response = await axios.get(`https://services.tokenview.io/vipapi/address/btc/${address}/1/50?apikey=${API_KEY}`);
        return response.data.data; // Assuming the data is in the 'data.data' property
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

// Controller function to get all transactions
async function getAllTransactionController(req, res) {
    try {
        const address = req.params.address;
        const transactions = await fetchTransactions(address);
        const transformedTransactions = transactions.map(tx => transformBitcoinTransaction(tx, address));
        res.status(200).json({ result: transformedTransactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllTransactionController,
};
