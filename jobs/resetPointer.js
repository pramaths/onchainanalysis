const cron = require('node-cron');
const { resetAllPointers } = require('../db/providerService');

cron.schedule('0 0 * * *', () => {
  resetAllPointers().then(() => {
    console.log('All pointers have been reset.');
  }).catch(error => {
    console.error('Failed to reset pointers:', error);
  });
});
