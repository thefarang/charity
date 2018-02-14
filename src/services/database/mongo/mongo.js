'use strict'

const config = require('config')
const mongoose = require('mongoose')
const servLog = require('../../log')
const userActions = require('./actions/users')
const tokenActions = require('./actions/tokens')

let isConnected = false

// @todo critical - reconnect if connection drops
const connect = () => {
  if (!isConnected) {
    const conn = `${config.get('database.mongo.db_conn')}/${config.get('database.mongo.db_name')}`
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

module.exports = () => {
  connect()
  return {
    disconnect,
    getUserActions: () => userActions,
    getTokenActions: () => tokenActions
  }
}
