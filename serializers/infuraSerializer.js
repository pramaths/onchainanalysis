function infuraSerializer(data) {
    return {
        transactionHash: data.hash,
        from_address: data.from,
        from_label: data.from_label || null,
        to_address: data.to,
        to_label: data.to_label || null,
        value: data.value,
        timestamp: new Date(data.timeStamp * 1000),
        nonce: data.nonce,
        blockNumber: data.blockNumber,
        status: data.isSuccess,
        contractAddress: data.contractAddress || null,
    };
}