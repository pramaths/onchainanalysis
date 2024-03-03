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

module.exports = { getWalletTransactions };
