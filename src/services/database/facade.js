'use strict'

const config = require('config')
const mongoose = require('mongoose')

const log = require('../log')
const userActions = require('./actions/users')

let isConnected = false

const connect = () => {
  if (!isConnected) {
    mongoose.Promise = global.Promise
    mongoose.connect(config.get('database.db_conn'), {
      useMongoClient: true
    })
    isConnected = true
  }
}

const disconnect = () => {
  mongoose.connection.close(() => {
    log.info({}, 'Closed Mongo connection successfully. Exiting...')
    process.exit(0)
  })
}

const getUserActions = () => userActions

module.exports = {
  connect,
  disconnect,
  getUserActions
}
