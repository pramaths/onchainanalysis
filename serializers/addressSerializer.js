const addressSerializer = (address, chain)=>{
    if(!address || !chain ){
      return res.status(400).send({ error: "Address, chain and balance are required" });
    }
    const addressDetails = {
        address: address,
        balance: address.balance,
        chain : chain.toLowerCase(),
      }
    if(chain === 'eth'){
        addressDetails.ercTokens = address.ercTokens ;
    }
 
}


module.exports = { addressSerializer };