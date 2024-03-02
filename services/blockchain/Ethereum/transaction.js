const Moralis = require('moralis').default;

// Initialize Moralis once, ideally in a separate config file or at the start of your server
const initializeMoralis = async () => {
  await Moralis.start({ apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImEzZTA5ZDgyLTU3YjEtNGZlMy04MjY3LTk3NWI1MjZmOWJmZCIsIm9yZ0lkIjoiMjYxNjMzIiwidXNlcklkIjoiMjY1ODk2IiwidHlwZUlkIjoiMjU5MTRlZGYtNDdjMy00Y2ZhLWI1NjktMGMzNDg3ZWQ1NTI3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDYxODExOTIsImV4cCI6NDg2MTk0MTE5Mn0._EvFooXZJKB4aRbKXf_W6-VJJv9S_IaYBZUZOyC0Jtg'});
};

const getWalletTransactions = async (req, res) => {
  try {
    await initializeMoralis(); // Ensure Moralis is initialized

    const { chain, address } = req.params; // Extract parameters from the request
    console.log(chain,address)
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      chain,
      address,
      limit: 100,
      order: "DESC",
    });

    res.json(response.raw); // Send the raw response back to the client
  } catch (e) {
    console.error(e);
    res.status(500).send('An error occurred while fetching transactions');
  }
};

module.exports = { getWalletTransactions };
