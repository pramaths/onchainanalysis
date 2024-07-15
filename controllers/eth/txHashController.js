const {txHash} = require('../../services/blockchain/Bitcoin/btcChain/queryParams');


const getTxHashDetails = async (req, res) => {
    const txHash = req.params.txHash;
    const results = await txHash(providerConfigs, txHash);
    res.send(results);
}