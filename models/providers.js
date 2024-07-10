const mongoose = require('mongoose');
const { Schema } = mongoose;

const providerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  apiKeys: {
    type: [String],
    required: true
  },
  currentPointer: {
    type: Number,
    default: 0
  }
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;