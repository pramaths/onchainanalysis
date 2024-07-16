const EventSource = require('eventsource');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const address = 'bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c';
const eventSource = new EventSource(`http://localhost:8000/api/btc/trace/transactions/${address}`);

// Initialize CSV writer
const csvWriter = createCsvWriter({
  path: 'transactions_log.csv',
  header: [
    { id: 'layer', title: 'LAYER' },
    { id: 'from_address', title: 'FROM_ADDRESS' },
    { id: 'to_address', title: 'TO_ADDRESS' },
    { id: 'value', title: 'VALUE' },
    { id: 'totalProcessed', title: 'TOTAL_PROCESSED' },
  ]
});

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  if (data.type === 'transactions') {
    console.log(`Processing transactions for layer ${data.layerNumber}`);
    
    data.transactions.forEach((transaction, index) => {
      const logEntry = {
        layer: data.layerNumber,
        from_address: transaction.from_address,
        to_address: transaction.to_address,
        value: transaction.value/100000000,
        txid: transaction.txid,
        totalProcessed: data.totalProcessed,
      };
      
      console.log(`Layer: ${logEntry.layer}, From: ${logEntry.from_address}, To: ${logEntry.to_address}, Value: ${logEntry.value}, TXID: ${logEntry.txid}`);
      
      // Write the log entry to the CSV file
      csvWriter.writeRecords([logEntry])
        .then(() => console.log('Transaction log entry written to CSV file.'))
        .catch(err => console.error('Error writing to CSV:', err));
      
      // Log the first transaction in each batch
      if (index === 0) {
        console.log('First transaction in batch:', JSON.stringify(transaction, null, 2));
      }
    });
  } else if (data.type === 'info' || data.type === 'error') {
    const logEntry = {
      layer: '',
      from_address: '',
      to_address: '',
      value: '',
      totalProcessed: '',
    };
    
    console.log(`${data.type.toUpperCase()}: ${data.message}`);
    
    csvWriter.writeRecords([logEntry])
      .then(() => console.log(`${data.type} log entry written to CSV file.`))
      .catch(err => console.error('Error writing to CSV:', err));
  }
};

eventSource.onerror = function(error) {
  console.error('EventSource failed:', error);
  const logEntry = {
    layer: '',
    from_address: '',
    to_address: '',
    value: '',
    totalProcessed: '',
  };
  
  csvWriter.writeRecords([logEntry])
    .then(() => console.log('Error log entry written to CSV file.'))
    .catch(err => console.error('Error writing to CSV:', err));
};