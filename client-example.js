const EventSource = require('eventsource'); // You might need to install this package for Node.js clients

const address = 'bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c';
const eventSource = new EventSource(`http://localhost:8000/api/bitcoin/trace/transactions/bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c`);

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'info':
      console.log('Info:', data.message);
      break;
    case 'progress':
      console.log('Progress:', data.message);
      break;
    case 'transactions':
      console.log(`Received batch ${data.batchNumber} with ${data.batchSize} transactions`);
      console.log(`Total transactions processed: ${data.totalProcessed}`);
      console.log('Timestamp:', data.timestamp);
      console.log('First transaction in batch:', data.transactions[0]);
      break;
    case 'stats':
      console.log(`Batch ${data.batchNumber} processed in ${data.processingTime}ms`);
      console.log(`Total transactions processed: ${data.totalProcessed}`);
      break;
    case 'error':
      console.error('Error:', data.message);
      break;
    default:
      console.log('Unknown event type:', data);
  }
};

eventSource.onerror = function(error) {
  console.error('EventSource failed:', error);
};