const express = require('express');
const axios = require('axios');
const { Network, Alchemy } = require('alchemy-sdk');
const app = express();
const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

// Utility function to fetch balance from Etherscan
const fetchBalanceFromEtherscan = async (address) => {
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`;
  const response = await axios.get(url);
  return response.data.result; // Returns the balance
};

// Controller to handle the combined data fetching
const getCryptoData = async (req, res) => {
  try {
    const { address } = req.params;
    const balancePromise = fetchBalanceFromEtherscan(address);
    const transactionCountPromise = alchemy.core.getTransactionCount(address);

    // Await both promises simultaneously for efficiency
    const [balance, transactionCount] = await Promise.all([balancePromise, transactionCountPromise]);

    // Combine the data into a single object
    const combinedData = {
      address,
      balance,
      transactionCount,
    };

    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching cryptocurrency data.');
  }
};

// Define a route
app.get('/api/crypto/:address', getCryptoData);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
