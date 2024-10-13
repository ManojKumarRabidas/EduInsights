// models/authentication.js
const mongoose = require('mongoose');

const authenticationSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true},
  login_id: {type: String, required: true, unique: true,},
  password: {type: String, required: true},
  last_log_in: {type: Date,default: null},
  user_type: {type: String, default: null},
  active: {type: Number, default: 0},
  is_verified: {type: Number,default: 0},
  otpDetails: {type: Object},
  verifiedAt: {type: Date},
  verifiedBy: {type: mongoose.Schema.Types.ObjectId}

});

const Authentication = mongoose.model('Authentication', authenticationSchema);
module.exports = Authentication;
