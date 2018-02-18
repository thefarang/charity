'use strict'

const crypto = require('crypto')
const _ = require('lodash')
const Token = require('../models/token')

const createTokenFromUserId = (userId) => {
  const token = new Token()
  token.userId = userId
  token.token = crypto.randomBytes(32).toString('hex')
  return token
}

const createToken = (schema, schemaToCauseMapping) => {
  const token = new Token()
  if (schemaToCauseMapping['userId']) {
    token.userId = _.get(schema, schemaToCauseMapping.userId)
  }
  if (schemaToCauseMapping['token']) {
    token.token = _.get(schema, schemaToCauseMapping.token)
  }
  return token
}

module.exports = {
  createTokenFromUserId,
  createToken
}
