const mongoose = require('mongoose');
const { Schema } = mongoose;

const Users = new Schema({
  Email: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
 username : {
    type: String,
    required: true,
  },
  investigations: [{
    type: Schema.Types.Mixed,  // Allows storage of any JSON object
    required: true
  }],
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
});

const User = mongoose.model('Provider', Users);

module.exports = User;
