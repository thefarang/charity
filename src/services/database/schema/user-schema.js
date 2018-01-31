'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// @todo
// Create a counter collection separately which is incremented when a new user is added.
// Look online for the pattern for this.

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    index: { unique: true }
  },
  encPassword: {
    type: String,
    trim: true,
    required: true
  },
  role: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    }
  }
}, {
  collection: 'user'
})

// Generate a mongo Model from the Schema.
module.exports = mongoose.model('UserSchema', UserSchema)
