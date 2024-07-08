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

const rotateAPI = () => {
  console.log("Rotating API Key...");
  curr = (curr + 1) % apiList.length;
  return initAPI();
};


  module.exports = {
    initAPI,
  };