
function EvmChainSerializer(data) {
    formatedData=[];
    data.map((item) => {
        formatedData.push({
            transactionHash: item.hash,
            from_address: item.from,
            to_address: item.to,
            value: item.value,
            timestamp: new Date(item.timeStamp * 1000),
            nonce: item.nonce,
            blockNumber: item.blockNumber,
            status: item.isSuccess,
            contractAddress: item.contractAddress || null,
        });}
    );
    return formatedData;
}

module.exports ={ EvmChainSerializer};