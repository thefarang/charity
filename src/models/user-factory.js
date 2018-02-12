'use strict'

const config = require('config')

const User = require('./user')
const RoleFactory = require('./role-factory')

const createFromSchema = (schema) => {
  return new User(schema)
}

const createGuestUser = () => {
  const role = RoleFactory.createGuestRole()
  return createFromSchema({
    user_role_id: role.id,
    user_role_name: role.name
  })
}

module.exports = {
  createFromSchema,
  createGuestUser
}
