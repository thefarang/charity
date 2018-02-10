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
    user_id: config.get('system_users.guest.id'),
    user_email: config.get('system_users.guest.email'),
    user_role_id: role.id,
    user_role_name: role.name
  })
}

module.exports = {
  createFromSchema,
  createGuestUser
}
