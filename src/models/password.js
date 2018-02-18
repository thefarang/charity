'use strict'

const bcrypt = require('bcryptjs')
const config = require('config')
const servLog = require('../services/log')

const SALT_WORK_FACTOR = Number(config.get('password.salt_work_factor'))

class Password {
  constructor () {
    this.isReset = false
    this.clearPassword = null
    this.encryptedPassword = null
  }

  isClearPasswordCorrect (clearPassword, encryptedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(clearPassword, encryptedPassword, (err, isMatch) => {
        if (err) {
          servLog.info({ err: err }, 'An error occurred validating a password')
          return reject(err)
        }
        return resolve(isMatch)
      })
    })
  }

  getEncPasswordFromClearPassword (clearPassword) {
    return new Promise((resolve, reject) => {
      // Generate a salt
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
          servLog.info({ err: err }, 'An error occurred generating a salt')
          return reject(err)
        }

        // Hash the password using our new salt
        bcrypt.hash(clearPassword, salt, (err, encryptedPassword) => {
          if (err) {
            servLog.info({ err: err }, 'An error occurred hashing a password')
            return reject(err)
          }
          return resolve(encryptedPassword)
        })
      })
    })
  }
}

module.exports = Password
