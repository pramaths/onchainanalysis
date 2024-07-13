
function transformBitcoinTransaction(transaction, address) {
    const transactions = [];
  
    if (!transaction.vin) {
      if (transaction.prevout.scriptpubkey_address !== address) {
        console.log("No vin found in transaction:", transaction.txid);
        const tx = {
          block_hash: transaction.block_hash || "",
          block_number: transaction.block_no || "",
          block_timestamp: transaction.block_timestamp
            ? new Date(transaction.block_timestamp).toISOString()
            : "",
          from_address: transaction.prevout.scriptpubkey_address,
          to_address: address,
          value: transaction.vout[0].value || "",
          txid: transaction.txid || "",
          block_time: transaction.status.block_time || "",
        };
        console.log("+++", tx);
        transactions.push(tx);
      }
    }
    if (transaction.vin && transaction.vin.length > 0) {
      transaction.vin.forEach((input) => {
        if (input.prevout && input.prevout.scriptpubkey_address !== address) {
          const tx = {
            block_hash: transaction.block_hash || "",
            block_number: transaction.block_no || "",
            block_timestamp: transaction.block_timestamp
              ? new Date(transaction.block_timestamp).toISOString()
              : "",
            from_address: input.prevout.scriptpubkey_address  || "pramath",
            to_address: address ,
            value: input.prevout.value || "",
            txid: transaction.txid || "",
            block_time: transaction.status.block_time || "",
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
          block_hash: transaction.block_hash || "",
          block_number: transaction.block_no || "",
          block_timestamp: transaction.block_timestamp
            ? new Date(transaction.block_timestamp).toISOString()
            : "",
          from_address: address,
          to_address: output.scriptpubkey_address || "",
          value: output.value,
          txid: transaction.txid || "",
          block_time: transaction.status.block_time || "",
        };
        transactions.push(tx);
      }
    });
  }
    console.log("___", transactions);
    return transactions;
  }


  module.exports = { transformBitcoinTransaction };