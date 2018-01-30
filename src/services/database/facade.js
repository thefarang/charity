'use strict'

const config = require('config')
const log = require('../log')
const mongoose = require('mongoose')
// const roleActions = require('./actions/roles')
// const userActions = require('./actions/users')

let isConnected = false

const connect = () => {
  if (!isConnected) {
    mongoose.Promise = global.Promise
    mongoose.connect(config.get('dbConn'), {
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

/*
const getRoleActions = () => roleActions

const getUserActions = () => userActions
*/

module.exports = {
  connect,
  disconnect
  /*,
  getRoleActions,
  getUserActions
  */
}
