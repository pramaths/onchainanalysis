function moralisSerializer(data) {
    return {
        transactionHash: data.hash,
        from_address: data.from,
        to_address: data.to,
        value: data.value,
        timestamp: new Date(data.timeStamp * 1000),
        nonce: data.nonce,
        blockNumber: data.blockNumber,
        status: data.isSuccess,
        contractAddress: data.contractAddress || null,
        logs: data.logs || []
    };
}