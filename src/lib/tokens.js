'use strict'

const jwt = require('jsonwebtoken')
const config = require('config')
const servLog = require('../services/log')
const UserFactory = require('../models/user-factory')

const createToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user.toSecureSchema(),
      config.get('token.secret'),
      {
        expiresIn: config.get('token.duration')
      },
      (err, token) => {
        if (err) {
          // @todo - add logging
          return reject(err)
        }
        return resolve(token)
      }
    )
  })
}

const getToken = (req) => {
  return req.cookies.token || null
}

const getUserByToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('token.secret'), (err, decodedUserSchema) => {
      if (err) {
        servLog.info({ err: err }, 'An error occurred verifying the json web token')
        return resolve(null)
      }

      return resolve(UserFactory.createFromSchema(decodedUserSchema))
    })
  })
}

module.exports = {
  createToken,
  getToken,
  getUserByToken
}
