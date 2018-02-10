'use strict'

const Role = require('./role')

const createFromSchema = (schema) => {
  const role = new Role()
  role.id = schema.user_role_id || null
  role.name = schema.user_role_name || null
  return role
}

module.exports = {
  createFromSchema
}
