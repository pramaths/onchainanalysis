const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProviderSchema = new Schema({
  providerName: {
    type: String,
    required: true
  },
  apiKeys: {
    type: [String],
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['SDK', 'URL']
  },
  currentPointer: {
    type: Number,
    default: 0
  }
});

const Provider = mongoose.model('Provider', ProviderSchema);

module.exports = Provider;
