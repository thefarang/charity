'use strict'

const jwt = require('jsonwebtoken')
const config = require('config')
const servLog = require('../services/log')
const UserFactory = require('../factories/user-factory')

const createJWToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user.toJSONWithoutPassword(),
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

const getJWToken = (req) => req.cookies.token || null

const getUserByJWToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('token.secret'), (err, userJson) => {
      if (err) {
        servLog.info({ err: err }, 'An error occurred verifying the json web token')
        return resolve(null)
      }

      return resolve(UserFactory.createUserFromJSON(userJson))
    })
  })
}

module.exports = {
  createJWToken,
  getJWToken,
  getUserByJWToken
}
