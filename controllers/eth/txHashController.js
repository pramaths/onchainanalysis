const {txHash} = require('../../services/blockchain/Bitcoin/btcChain/queryParams');
const Moralis = require("moralis").default;
const { processGraphData } = require("../../serializers/processGraphdata");


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
      let chainId;
      if(chain === 'eth'){
         chainId= '0x1';
        }
        console.log("chain")
      console.log("txhash",txhash);
      console.log("chainid",chainId);
      if (!txhash) {
        return res.status(400).send({ error: "Transaction hash is required" });
      }
  
      const response = await Moralis.EvmApi.transaction.getTransaction({
        chain: "0x1",
        transactionHash: txhash,
      });
      console.log(response);
      if (response.raw) {

        serialized = (moralisSerializer(response.raw));
        graphdata = processGraphData(serialized, serialized[0].from_address, response.raw.chain);
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