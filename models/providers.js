const mongoose = require('mongoose');
const { Schema } = mongoose;

const apiProviderSchema = new Schema({
  providerName: {
    type: String,
    required: true
  },
  apiKey: {
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

const ApiProvider = mongoose.model('ApiProvider', apiProviderSchema);

module.exports = ApiProvider;
