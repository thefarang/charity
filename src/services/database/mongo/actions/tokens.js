'use strict'

const mongoose = require('mongoose')
const servLog = require('../../../log')
const TokenSchema = require('../schema/token-schema')
const TokenFactory = require('../../../../factories/token-factory')
const TokenFromDbTokenMapping = require('../mappings/token-from-db-token')

const findToken = (tokenString) => {
  return new Promise((resolve, reject) => {
    TokenSchema.findOne({ token: tokenString }, (err, tokenSchema) => {
      if (err) {
        servLog.info({ err: err, token: tokenString }, 'Error locating existing Token')
        return reject(err)
      }

      if (!tokenSchema) {
        return resolve(null)
      }
      return resolve(TokenFactory.createToken(tokenSchema, TokenFromDbTokenMapping))
    })
  })
}

const saveToken = (token) => {
  return new Promise(async (resolve, reject) => {
    const tokenSchema = new TokenSchema()
    tokenSchema.user_id = token.userId
    tokenSchema.token = token.token
    tokenSchema.save((err) => {
      if (err) {
        servLog.info({ err: err, token: token }, 'Error saving the TokenSchema')
        return reject(err)
      }
      return resolve(token)
    })
  })
}

const removeToken = (token) => {
  return new Promise((resolve, reject) => {
    TokenSchema.remove({ token: token.token }, (err) => {
      if (err) {
        servLog.info({ err: err, token: token }, 'Error whilst deleting token')
        return reject(err)
      }
      return resolve()
    })
  })
}

module.exports = {
  findToken,
  saveToken,
  removeToken
}
