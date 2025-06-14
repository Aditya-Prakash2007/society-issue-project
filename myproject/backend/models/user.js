// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  flatNo: String,
  role: String,
   contact: String,
  tokens: {
    type: Number,
    default: 0  // start with 0 tokens
  }
});

module.exports = mongoose.model('User', userSchema);


