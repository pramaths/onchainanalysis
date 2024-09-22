function tronChainSerializer(data){
    formatedData=[];
    console.log("daadaa",data);
    data.map((item) => {
        formatedData.push({
            block_hash: item.hash,
            from_address: item.from,
            to_address: item.to,
            value: item.amount / 1e6,
            timestamp: new Date(item.block_timestamp * 1000),
            nonce: item.nonce,
            blockNumber: item.block,
            status: item.contract_ret=== "SUCCESS" ? true : false,
            contractAddress: item.contractAddress || null,
        });}
    );
    return formatedData;
}

module.exports ={ tronChainSerializer};