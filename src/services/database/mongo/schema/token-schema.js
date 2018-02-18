'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TokenSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    required: true, 
    default: Date.now, 
    expires: 43200 // 12 hours
  }
}, {
  collection: 'token'
})

// Generate a mongo Model from the Schema.
module.exports = mongoose.model('TokenSchema', TokenSchema)
