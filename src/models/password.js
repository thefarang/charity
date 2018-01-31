'use strict'

const bcrypt = require('bcryptjs')
const log = require('../services/log')

// @todo parameterise this
const SALT_WORK_FACTOR = 10

class Password {
  constructor() {
    this.clrPassword = null
    this.encPassword = null
  }

  isClearPasswordCorrect(clrPassword, encPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(clrPassword, encPassword, (err, isMatch) => {
        if (err) {
          log.info({ err: err }, 'An error occurred validating a password')
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
          log.info({ err: err }, 'An error occurred generating a salt')
          return reject(err)
        }

        // Hash the password using our new salt
        bcrypt.hash(clrPassword, salt, (err, encPassword) => {
          if (err) {
            log.info({ err: err }, 'An error occurred hashing a password')
            return reject(err)
          }
          return resolve(encPassword)
        })
      })
    })
  }
}

module.exports = Password
