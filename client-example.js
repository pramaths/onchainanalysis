const EventSource = require('eventsource');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const address = 'bc1qhg7fpzxl68m2g5l0ane9h9akw4hfnh2s8hn3gm';
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
        value: transaction.value / 100000000, // Convert from satoshi to BTC
        txid: transaction.txid,
        totalProcessed: data.totalProcessed,
      };

      // Log first transaction in each batch for visibility
      if (index === 0) {
        console.log('First transaction in batch:', JSON.stringify(transaction, null, 2));
      }
      
      // Write the log entry to the CSV file
      csvWriter.writeRecords([logEntry])
        .then(() => console.log('Transaction log entry written to CSV file.'))
        .catch(err => console.error('Error writing to CSV:', err));
    });
  } else if (data.type === 'info' || data.type === 'error') {
    console.log(`${data.type.toUpperCase()}: ${data.message}`);
  }
};

eventSource.onerror = function(error) {
  console.error('EventSource failed:', error);
  if (error.status) {
    console.error('HTTP status code:', error.status);
  }
  if (error.message) {
    console.error('Error message:', error.message);
  }
  eventSource.close();
};

eventSource.onopen = function() {
  console.log("Connection to server opened.");
};

// Add a listener for the 'end' event type which should be sent by the server
eventSource.addEventListener('close', function() {
  console.log('End of data stream.');
  eventSource.close(); // Close the connection after receiving 'end' event
});
