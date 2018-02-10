'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  user_email: {
    type: String,
    trim: true,
    required: true,
    index: { unique: true }
  },
  user_encrypted_password: {
    type: String,
    trim: true,
    required: true
  },
  user_role_id: {
    type: Number,
    required: true
  },
  user_role_name: {
    type: String,
    trim: true,
    required: true
  }
}, {
  collection: 'user'
})

// Generate a mongo Model from the Schema.
module.exports = mongoose.model('UserSchema', UserSchema)
