const { response } = require('express');

const Moralis = require('moralis').default;
Moralis.start({
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjIwYjI0YTZmLWM2ZTAtNDNhMi1iZDRjLWZkMzg3OTg0NjBhZCIsIm9yZ0lkIjoiMzgwODc2IiwidXNlcklkIjoiMzkxMzY1IiwidHlwZUlkIjoiZTI5YjE3OTYtYjY1Ny00MjBlLTlmYWYtNmIxMTRlMWNkZTVkIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDkzNzcxMDgsImV4cCI6NDg2NTEzNzEwOH0.8Ls8RNcqOgBDtrULE_Ta8Itq29FKD-Nt1H5GihK6gWM'
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
