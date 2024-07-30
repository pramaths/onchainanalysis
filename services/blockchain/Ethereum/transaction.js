const Moralis = require("moralis").default;
const redisClient = require('../../../utils/redis');
const {moralisSerializer} = require('../../../serializers/moralisSerializer');
const {identifyEVMchain} = require('../../../utils/identifyBlockchain');
Moralis.start({
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE0OWZiNmVmLTFlMjEtNDEwOC1hOGEyLTMyZWNhYmIwZDIyYSIsIm9yZ0lkIjoiMzgwOTMyIiwidXNlcklkIjoiMzkxNDI0IiwidHlwZUlkIjoiYmUzNWFhZDgtNjllYi00MGI3LWFlZWYtYzA2NDJiY2ZmNGY0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDk0MDUxNDQsImV4cCI6NDg2NTE2NTE0NH0.X2AL9Ir4Maawo1KiS7A2HxF6eyJewCD80mkRioQdzsA",
})
  .then(() => console.log("Moralis initialized successfully."))
  .catch((error) => console.error("Failed to initialize Moralis:", error));



const getWalletTransactions = async (address,cursor, chain) => {
  try {
    // const cachedData = await redisClient.get("cachedData");
    // if (!cachedData) {
      // const pagesize = parseInt(req.params.pagesize, 10) || 100;
      // let cursor = null;
      if(cursor){
      const chainID = identifyEVMchain(chain)
      const pagesize = 100;
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        chain: chainID || chain,
        address,
        limit: pagesize || 100,
        order: "DESC",
        cursor:cursor ,
      });
      cursor = response.raw.cursor;
      formattedData = moralisSerializer(response.raw.result);
      formattedData.push(cursor)
      return formattedData;
    }
    else{
      const chainID =   chain ? identifyEVMchain(chain) : '0x1';
      const pagesize = 100;
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        chain: chainID || chain,
        address,
        limit: pagesize || 100,
        order: "DESC",
      });
      cursor = response.raw.cursor;
      cursor = {cursor:cursor}
      formattedData = moralisSerializer(response.raw.result);
      formattedData.push(cursor)
      console.log("formattedData",formattedData)
      return formattedData;
    }

      // console.log("Data retrieved from API ->", JSON.parse(response.raw.result.length));
      // await redisClient.set("cachedData", JSON.stringify(response.raw));
      // console.log("Caching in Redis...")
     
    // } else {
    //   console.log("Data retrieved from Redis cache ->", JSON.parse(cachedData).result.length);
    //   res.json(JSON.parse(cachedData));
    // }
  } catch (e) {
    console.error(e);
  }
};


module.exports = { getWalletTransactions };
