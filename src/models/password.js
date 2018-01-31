'use strict'

const bcrypt = require('bcryptjs')

const SALT_WORK_FACTOR = 10 // @todo parameterise this

class Password {
  constructor() {
    this.clrPassword = null
    this.encPassword = null
  }

  isClearPasswordCorrect(clrPassword, encPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(clrPassword, encPassword, function (err, isMatch) {
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
      bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
          // @todo add logging
          return reject(err)
        }

        // Hash the password using our new salt
        bcrypt.hash(userSchema.password, salt, function (err, encPassword) {
          if (err) {
            // @todo add logging
            return reject(err)
          }
          return resolve(encPassword)
        })
      })
    })
  }
}

module.exports = Password
