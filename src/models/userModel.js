const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // emailToken: {
  //   type: String,
  // },
  // isVerified: {
  //   type: Boolean,
  // },
  Date: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('User', userSchema)