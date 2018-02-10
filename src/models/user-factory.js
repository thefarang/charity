'use strict'

const User = require('./user')
const RoleFactory = require('./role-factory')
const PasswordFactory = require('./password-factory')

const createFromSchema = (schema) => {
  return new User(schema)
}

// @todo HERE
// move data helpers here: createGuestUser()

module.exports = {
  createFromSchema
}
