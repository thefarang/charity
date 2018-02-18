'use strict'

const mongo = require('./mongo/mongo')
// const mysql = require('./mysql/mysql')

module.exports = (database) => {
  if (database === 'mongo') {
    return mongo()
  }
  return null
}
