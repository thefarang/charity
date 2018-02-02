'use strict'

const jwt = require('jsonwebtoken')
const config = require('config')

const log = require('../services/log')

const User = require('../models/user')
const Password = require('../models/password')
const Role = require('../models/role')

const createToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user.toJSON(),
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

// Note that this method returns a partially-hydrated User object. The
// User.Password details are omitted, as they are not stored in the Token.
// Therefore, remember to hydrate the User.Password details later if you
// intend to update the User record in the database.
const getUserByToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('token.secret'), (err, decodedUserData) => {
      if (err) {
        log.info({ err: err }, 'An error occurred verifying the json web token')
        return resolve(null)
      }

      const user = new User()
      user.id = decodedUserData.id
      user.email = decodedUserData.email
      user.password = new Password()
      user.role = new Role(decodedUserData.role.id, decodedUserData.role.name)
      return resolve(user)
    })
  })
}

module.exports = {
  createToken,
  getToken,
  getUserByToken
}
