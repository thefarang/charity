'use strict'

const bcrypt = require('bcryptjs')
const config = require('config')

const servLog = require('../services/log')

const SALT_WORK_FACTOR = config.get('password.salt_work_factor')

class Password {
  constructor() {
    this.clrPassword = null
    this.encPassword = null
  }

  isClearPasswordCorrect(clrPassword, encPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(clrPassword, encPassword, (err, isMatch) => {
        if (err) {
          servLog.info({ err: err }, 'An error occurred validating a password')
          return reject(err)
        }
        return resolve(isMatch)
      })
    })
  }

  getEncPasswordFromClearPassword(clrPassword) {
    return new Promise((resolve, reject) => {
      // Generate a salt
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
          servLog.info({ err: err }, 'An error occurred generating a salt')
          return reject(err)
        }

        // Hash the password using our new salt
        bcrypt.hash(clrPassword, salt, (err, encPassword) => {
          if (err) {
            servLog.info({ err: err }, 'An error occurred hashing a password')
            return reject(err)
          }
          return resolve(encPassword)
        })
      })
    })
  }
}

module.exports = Password
