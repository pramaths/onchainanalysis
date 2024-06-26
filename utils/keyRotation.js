const { Alchemy, Network } = require("alchemy-sdk");

const apiList = [
  "6dkUPCaxLSKw7eufPzwVG7d_WD37h2FO",
  "gvGFt1jOABt1tDSCwPNqli0Ssrie7BAe",
];
let curr = 0;

const initAPI = () => {
  console.log("Initializing API Key: ", apiList[curr], "...");
  const config = {
    apiKey: apiList[curr],
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);
  return alchemy;
};

const rotateAPI = () => {
  console.log("Rotating API Key...");
  curr = (curr + 1) % apiList.length;
  return initAPI();
};

const fetchTransaction = (hash, alchemyInstance, res, retry = true) => {
    alchemyInstance.core.getTransaction(hash)
      .then(transaction => {
        if (transaction) {
          res.json(transaction);
        } else {
          res.status(404).send({ error: 'Transaction not found' });
        }
      })
      .catch(error => {
        console.error(error);
        if (retry && curr < apiList.length - 1) {
          const newAlchemy = rotateAPI();
          fetchTransaction(hash, newAlchemy, res, false); // Retry with new API key
        } else {
          res.status(500).send({ error: 'An error occurred while fetching transaction details' });
        }
      });
  };

  module.exports = {
    initAPI,
    fetchTransaction,
  };