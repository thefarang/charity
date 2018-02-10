'use strict'

const Role = require('./role')
const roleDataHelper = require('../data/roles')

const createFromSchema = (schema) => {
  return new Role(schema.user_role_id, schema.user_role_name)
}

const createGuestRole = () => {
  const roleSchemas = roleDataHelper.getAllRoleSchemas()
  const guestRoleSchema = roleSchemas.find((roleSchema) => {
    return (roleSchema.user_role_name === 'guest') ? true : false
  })
  const guestRole = createFromSchema(guestRoleSchema)
  return guestRole
}

module.exports = {
  createFromSchema,
  createGuestRole
}
