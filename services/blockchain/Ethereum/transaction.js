
const Moralis = require('moralis').default;
Moralis.start({
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImEzZTA5ZDgyLTU3YjEtNGZlMy04MjY3LTk3NWI1MjZmOWJmZCIsIm9yZ0lkIjoiMjYxNjMzIiwidXNlcklkIjoiMjY1ODk2IiwidHlwZUlkIjoiMjU5MTRlZGYtNDdjMy00Y2ZhLWI1NjktMGMzNDg3ZWQ1NTI3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDYxODExOTIsImV4cCI6NDg2MTk0MTE5Mn0._EvFooXZJKB4aRbKXf_W6-VJJv9S_IaYBZUZOyC0Jtg'
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
