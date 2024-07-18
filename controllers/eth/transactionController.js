const {getWalletTransactions} =require('../../services/blockchain/Ethereum/transaction');
const {processGraphData}= require('../../serializers/processGraphdata')

const getTransactions =async(req,res)=>{
    try{
        const {address} = req.params;
        const transactions = await getWalletTransactions(address);
        const graphData = processGraphData(transactions,0, address, 'eth');
        res.json({
            results: {
                transactions: transactions,
                graphData: graphData
            }
        });
}
    catch(e){
        console.error(e);
        res.status(500).send({error:"An error occurred while fetching transactions"});
    }
}

module.exports = {getTransactions};