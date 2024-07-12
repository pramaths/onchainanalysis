const Provider = require('../models/providers');
const logger = require('../utils/logger');

async function fetchAndSortProviders() {
  try {
  const providers = await Provider.find({}).sort({ type: 1 }); 
  return providers;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
}

async function updateCurrentPointer(providerId, newPointer) {
  try {
    await Provider.findByIdAndUpdate(providerId, { currentPointer: newPointer });
  } catch (error) {
    console.error('Error updating current pointer:', error);
    throw error;
  }
}

async function resetAllPointers() {
  try {
    await Provider.updateMany({}, { currentPointer: 0 });
  } catch (error) {
    console.error('Error resetting all pointers:', error);
    throw error;
  }
}


module.exports = {
  fetchAndSortProviders,
  updateCurrentPointer,
  resetAllPointers
};
