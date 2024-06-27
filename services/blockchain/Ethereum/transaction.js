const Moralis = require("moralis").default;
const redisClient = require('../../../utils/redis');
Moralis.start({
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE0OWZiNmVmLTFlMjEtNDEwOC1hOGEyLTMyZWNhYmIwZDIyYSIsIm9yZ0lkIjoiMzgwOTMyIiwidXNlcklkIjoiMzkxNDI0IiwidHlwZUlkIjoiYmUzNWFhZDgtNjllYi00MGI3LWFlZWYtYzA2NDJiY2ZmNGY0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDk0MDUxNDQsImV4cCI6NDg2NTE2NTE0NH0.X2AL9Ir4Maawo1KiS7A2HxF6eyJewCD80mkRioQdzsA",
})
  .then(() => console.log("Moralis initialized successfully."))
  .catch((error) => console.error("Failed to initialize Moralis:", error));

const getWalletTransactions = async (req, res) => {
  try {
    const cachedData = await redisClient.get("cachedData");
    if (!cachedData) {
      const { chain, address } = req.params;
      const pagesize = parseInt(req.params.pagesize, 10) || 2;

      console.log(chain, address);

      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        chain,
        address,
        limit: pagesize || 2,
        order: "DESC",
      });
      
      console.log("Data retrieved from API ->", JSON.parse(response.raw.result.length));
      await redisClient.set("cachedData", JSON.stringify(response.raw));
      console.log("Caching in Redis...")
      res.json(response.raw);
    } else {
      console.log("Data retrieved from Redis cache ->", JSON.parse(cachedData).result.length);
      res.json(JSON.parse(cachedData));
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occurred while fetching transactions");
  }
};
const getTransactionDetails = async (req, res) => {
  try {
    const { hash } = req.params;
    console.log(hash);
    if (!hash) {
      return res.status(400).send({ error: "Transaction hash is required" });
    }

    const response = await Moralis.EvmApi.transaction.getTransaction({
      chain: "0x1",
      transactionHash: hash,
    });
    console.log(response);
    if (response.raw) {
      res.json(response.raw);
    } else {
      res.status(404).send({ error: "Transaction not found" });
    }
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ error: "An error occurred while fetching transaction details" });
  }
};

module.exports = { getWalletTransactions, getTransactionDetails };
