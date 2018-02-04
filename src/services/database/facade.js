'use strict'

const config = require('config')
const mongoose = require('mongoose')

const servLog = require('../log')
const userActions = require('./actions/users')

let isConnected = false

const connect = () => {
  if (!isConnected) {
    const conn = `${config.get('database.db_conn')}/${config.get('database.db_name')}`
    mongoose.Promise = global.Promise
    mongoose.connect(conn, {
      useMongoClient: true
    })
    isConnected = true
  }
}

const disconnect = () => {
  mongoose.connection.close(() => {
    servLog.info({}, 'Closed Mongo connection successfully. Exiting...')
    process.exit(0)
  })
}

const getUserActions = () => userActions

module.exports = {
  connect,
  disconnect,
  getUserActions
}
