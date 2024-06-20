const { response } = require('express');

const Moralis = require('moralis').default;
Moralis.start({
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijk1ZTQ3YTk5LWZiZWUtNDBhZS1hNDAxLWI1OTQ0OWE5MjllOCIsIm9yZ0lkIjoiMjYxNjMzIiwidXNlcklkIjoiMjY1ODk2IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiIyNTkxNGVkZi00N2MzLTRjZmEtYjU2OS0wYzM0ODdlZDU1MjciLCJpYXQiOjE3MTg5MTkwNTQsImV4cCI6NDg3NDY3OTA1NH0.I730tkh8BZv8HTivD8Jm_VvMMhkssXtAKOoddcsTJtg'
}).then(() => console.log('Moralis initialized successfully.'))
  .catch((error) => console.error('Failed to initialize Moralis:', error));

const getWalletTransactions = async (req, res) => {
  try {
    const { chain, address } = req.params;
    const pagesize = parseInt(req.params.pagesize, 10) || 100;

    console.log(chain, address);
    
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      chain,
      address,
      limit: pagesize || 100,
      order: "DESC",
    });
    res.json(response.raw); 
  } catch (e) {
    console.error(e);
    res.status(500).send('An error occurred while fetching transactions');
  }
};
const getTransactionDetails = async (req, res) => {
  try {
    // await initializeMoralis(); // Ensure Moralis is initialized

    const { hash } = req.params;
    console.log(hash)
    if (!hash) {
      return res.status(400).send({ error: 'Transaction hash is required' });
    }

    const response = await Moralis.EvmApi.transaction.getTransaction({
      chain: "0x1",
      transactionHash: hash
    });
console.log(response)
    if (response.raw) {
      res.json(response.raw);
    } else {
      res.status(404).send({ error: 'Transaction not found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'An error occurred while fetching transaction details' });
  }
};

module.exports = { getWalletTransactions,getTransactionDetails };
