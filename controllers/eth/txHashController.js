const {txHash} = require('../../services/blockchain/Bitcoin/btcChain/queryParams');
const Moralis = require("moralis").default;


const {moralisSerializer} = require('../../serializers/moralisSerializer');
if(!Moralis){
Moralis.start({
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE0OWZiNmVmLTFlMjEtNDEwOC1hOGEyLTMyZWNhYmIwZDIyYSIsIm9yZ0lkIjoiMzgwOTMyIiwidXNlcklkIjoiMzkxNDI0IiwidHlwZUlkIjoiYmUzNWFhZDgtNjllYi00MGI3LWFlZWYtYzA2NDJiY2ZmNGY0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDk0MDUxNDQsImV4cCI6NDg2NTE2NTE0NH0.X2AL9Ir4Maawo1KiS7A2HxF6eyJewCD80mkRioQdzsA",
})
  .then(() => console.log("Moralis initialized successfully."))
  .catch((error) => console.error("Failed to initialize Moralis:", error));
}

const getTransactionDetails = async (req, res) => {
    try {
      const { txhash, chain } = req.params;
      console.log(txhash);
      if (!txhash) {
        return res.status(400).send({ error: "Transaction hash is required" });
      }
  
      const response = await Moralis.EvmApi.transaction.getTransaction({
        chain: chain || "0x1",
        transactionHash: txhash,
      });
      console.log(response);
      if (response.raw) {

        res.json(moralisSerializer(response.raw));
        // res.json((response.raw));
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

module.exports = { getTransactionDetails };