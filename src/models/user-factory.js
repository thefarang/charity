'use strict'

const config = require('config')
const User = require('./user')
const RoleFactory = require('./role-factory')

// @todo createFromLoginAuthSchema, createFromRegisterAuthSchema, etc
// createFromSchema(schemaTranslate, schema)
//    schemaType.LoginAuthSchema, schemaType.RegisterAuthSchema
/*
UserFromMongoDbUser {
  "id": "_id",
  "email": "user_email"
  "password.clearPassword": null,
  "password.encryptedPassword": "encrypted_password"
}
*/
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
