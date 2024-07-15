let curr = 0;

const initAPI = () => {
  console.log("Initializing API Key: ", apiList[curr], "...");
  const config = {
    apiKey: apiList[curr],
    network: Network.ETH_MAINNET,
  };
  const Provider = new Alchemy(config);
  return alchemy;
};



  module.exports = {
    initAPI,
  };