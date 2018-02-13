'use strict'

const config = require('config')
const User = require('../models/user')
const UserRoles = require('../data/user-roles')
const Password = require('../models/password')

const createGuestUser = () => {
  const user = new User()
  user.role = UserRoles.GUEST
  return user
}

const createUserFromJSON = (json) => {
  const user = new User()
  user.id = json.id || null
  user.state = json.state || null
  user.email = json.email || null
  if (json.password) {
    user.password = new Password() 
    user.password.clearPassword = json.password.clearPassword || null
    user.password.encryptedPassword = json.password.encryptedPassword || null
  }
  user.role = json.role || null
  return user
}

const createUser = (schema, schemaToUserMapping) => {
  const user = new User()
  if (schemaToUserMapping['id']) {
    user.id = schema[schemaToUserMapping['id']]
  }
  if (schemaToUserMapping['state']) {
    user.state = schema[schemaToUserMapping['state']]
  }
  if (schemaToUserMapping['email']) {
    user.email = schema[schemaToUserMapping['email']]
  }
  if (schemaToUserMapping['password']) {
    user.password = new Password()
    if (schemaToUserMapping['password.clearPassword']) {
      user.password.clearPassword = schema[schemaToUserMapping['password.clearPassword']]
    }
    if (schemaToUserMapping['password.encryptedPassword']) {
      user.password.encryptedPassword = schema[schemaToUserMapping['password.encryptedPassword']]
    }
  }
  if (schemaToUserMapping['role']) {
    user.role = schema[schemaToUserMapping['role']]
  }
  return user
}

module.exports = {
  createUser,
  createUserFromJSON,
  createGuestUser
}
