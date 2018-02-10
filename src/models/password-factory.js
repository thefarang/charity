'use strict'

const Password = require('./password')

const createFromSchema = (schema) => {
  const password = new Password()
  password.clearPassword = schema.user_password || null
  password.encryptedPassword = schema.user_encrypted_password || null
  return password
}

module.exports = {
  createFromSchema
}
