// const EventSource = require('eventsource');
// const { Graph } = require('redis');
// const { aggregateTransactions } = require('./services/common/aggregationService');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const address = 'bc1qch6z8xgj9v86avvj63mddpva35klwh7rd6l78l';
// const eventSource = new EventSource(`http://localhost:8000/api/btc/stream/transactions/${address}`);

// // Initialize CSV writer
// const csvWriter = createCsvWriter({
//   path: 'transactions_log.csv',
//   header: [
//     { id: 'layer', title: 'LAYER' },
//     { id: 'from_address', title: 'FROM_ADDRESS' },
//     { id: 'to_address', title: 'TO_ADDRESS' },
//     { id: 'value', title: 'VALUE' },
//     { id: 'totalProcessed', title: 'TOTAL_PROCESSED' },
//     { id: 'GraphData', title: 'GRAPH_DATA' },
//     { id: 'aggregatedTransactions', title: 'AGGREGATED_TRANSACTIONS' },
//   ]
// });

// eventSource.onmessage = function(event) {
//   const data = JSON.parse(event.data);
  
//   if (data.type === 'transactions') {
//     console.log(`Processing transactions for layer ${data.layerNumber}`);
//     console.log(JSON.stringify(data))
//     data.aggregateTransactions.forEach((transaction, index) => {
//       const logEntry = {
//         layer: data.layerNumber,
//         from_address: transaction.from_address,
//         to_address: transaction.to_address,
//         value: transaction.value / 100000000, 
//         txid: transaction.txid,
//         totalProcessed: data.totalProcessed,
//         GraphData:JSON.stringify(data.graphData),
//         aggregatedTransactions:JSON.stringify(data.aggregatedTransactions)
//       };
//       console.log(data.graphData)

//       // Log first transaction in each batch for visibility
//       if (index === 0) {
//         console.log('First transaction in batch:', JSON.stringify(transaction, null, 2));
//       }
      
//       // Write the log entry to the CSV file
//       csvWriter.writeRecords([logEntry])
//         .then(() => console.log('Transaction log entry written to CSV file.'))
//         .catch(err => console.error('Error writing to CSV:', err));
//     });
//   } else if (data.type === 'info' || data.type === 'error') {
//     console.log(`${data.type.toUpperCase()}: ${data.message}`);
//   }
// };

// eventSource.onerror = function(error) {
//   console.error('EventSource failed:', error);
//   if (error.status) {
//     console.error('HTTP status code:', error.status);
//   }
//   if (error.message) {
//     console.error('Error message:', error.message);
//   }
//   eventSource.close();
// };

// eventSource.onopen = function() {
//   console.log("Connection to server opened.");
// };

// // Add a listener for the 'end' event type which should be sent by the server
// eventSource.addEventListener('close', function() {
//   console.log('End of data stream.');
//   eventSource.close(); // Close the connection after receiving 'end' event
// });


const apiKey = '9788928a-bbdb-44b7-96d7-0ba1198200d1';
const endpoint = 'https://apilist.tronscanapi.com/api/transfer/trx?address=TSTVYwFDp7SBfZk7Hrz3tucwQVASyJdwC7&start=0&limit=20&direction=0&reverse=true&fee=true&db_version=1&start_timestamp=&end_timestamp=';

fetch(endpoint, {
  headers: {
    'TRON-PRO-API-KEY': apiKey
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

