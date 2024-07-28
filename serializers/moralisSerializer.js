function moralisSerializer(data) {
    const dataArray = Array.isArray(data) ? data : [data];

    return dataArray.map(item => ({
        block_hash: item.hash,
        from_address: item.from_address || item.from,
        to_address: item.to_address || item.to,
        value: item.value,
        timestamp: new Date(item.block_timestamp),
        nonce: item.nonce || item.nonce,
        blockNumber: item.block_number || item.blockNumber,
        status: item.receipt_status === "1",
        contractAddress: item.receipt_contract_address || null,
    }));
}

module.exports = { moralisSerializer };