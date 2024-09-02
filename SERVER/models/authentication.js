// models/authentication.js
const mongoose = require('mongoose');

const authenticationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  login_id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  last_log_in: {
    type: Date,
    default: null,
  }
});

const Authentication = mongoose.model('Authentication', authenticationSchema);
module.exports = Authentication;
