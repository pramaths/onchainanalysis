const addressSerializer = (address, chain)=>{
    if(!address || !chain ){
      return res.status(400).send({ error: "Address, chain and balance are required" });
    }
    console.log("address", address);
    const addressDetails = {
        address: address.address,
        balance: address.balance || 0,
        chain : chain.toLowerCase(),
        transactionCount: address.transactionCount,
        firstTransactionTime: address.firstTransactionTime,
        lastTransactionTime: address.lastTransactionTime ,
        totalReceived: address.sendAmount  || 0,
        totalSent: address.receiveAmount  || 0,
        balanceSymbol: address.balanceSymbol || chain.toUpperCase()  ,
      }
    if(chain === 'eth'){
        addressDetails.ercTokens = address.ercTokens ;
    }
    return addressDetails;
 
}



module.exports = { addressSerializer };