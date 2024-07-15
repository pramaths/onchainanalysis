function transformBitcoinTransaction(transaction, address) {
  const transactions = [];
console.log("transaction",transaction);
console.log("address",address);
  if (!transaction.vin) {
    if (transaction.prevout.scriptpubkey_address !== address) {
      console.log("No vin found in transaction:", transaction.txid);
      const tx = {
        block_hash: transaction.status.block_hash || "",
        block_number: transaction.status.block_time || "",
        block_timestamp: transaction.status.block_time
          ? new Date(transaction.status.block_time).toISOString()
          : "",
        from_address: transaction.prevout.scriptpubkey_address,
        to_address: address,
        value: transaction.vout[0].value || "",
        txid: transaction.txid || "",
        status: transaction.status.confirmed ? "confirmed" : "unconfirmed",
      };
      transactions.push(tx);
    }
  }
  if (transaction.vin && transaction.vin.length > 0) {
    transaction.vin.forEach((input) => {
      if (input.prevout && input.prevout.scriptpubkey_address !== address) {
        const tx = {
          block_hash: transaction.status.block_hash || "",
          block_number: transaction.status.block_height || "",
          block_timestamp: transaction.status.block_time
            ? new Date(transaction.status.block_time).toISOString()
            : "",
          from_address: input.prevout.scriptpubkey_address  || "pramath",
          to_address: address ,
          value: input.prevout.value || "",
          txid: transaction.txid || "",
          status: transaction.status.confirmed ? "confirmed" : "unconfirmed",
          };
        transactions.push(tx);
      }
    });
  }

  if(   transaction.vout && transaction.vout.length> 0){
  transaction.vout.forEach((output) => {
    if (
      output.scriptpubkey_address &&
      output.scriptpubkey_address !== address
    ) {
      const tx = {
        block_hash: transaction.status.block_hash || "",
        block_number: transaction.status.block_height || "",
        block_timestamp: transaction.status.block_time
          ? new Date(transaction.status.block_time).toISOString()
          : "",
        from_address: address,
        to_address: output.scriptpubkey_address || "",
        value: output.value,
        txid: transaction.txid || "",
        status: transaction.status.confirmed ? "confirmed" : "unconfirmed",
      };
      transactions.push(tx);
    }
  });
}
  return transactions;
}

  module.exports = { transformBitcoinTransaction };