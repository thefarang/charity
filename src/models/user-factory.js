'use strict'

const config = require('config')
const User = require('./user')
const Password = require('./password')
const Role = require('./role')

const createGuestUser = () => {
  const user = new User()
  user.role = new Role()
  user.role.id = 1
  user.role.name = 'guest'
  return user
}

const createUserFromJSON = (json) => {
  const user = new User()
  user.id = json.id || null
  user.email = json.email || null
  if (json.password) {
    user.password = new Password() 
    user.password.clearPassword = json.password.clearPassword || null
    user.password.encryptedPassword = json.password.encryptedPassword || null
  }
  if (json.role) {
    user.role = new Role() 
    user.role.id = json.role.id || null
    user.role.name = json.role.name || null
  }
  return user
}

const createUser = (schema, schemaToUserMapping) => {
  const user = new User()
  if (schemaToUserMapping['id']) {
    user.id = schema[schemaToUserMapping['id']]
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
    user.role = new Role()
    if (schemaToUserMapping['role.id']) {
      user.role.id = schema[schemaToUserMapping['role.id']]
    }
    if (schemaToUserMapping['role.name']) {
      user.role.name = schema[schemaToUserMapping['role.name']]
    }
  }
  return user
}

module.exports = {
  createUser,
  createUserFromJSON,
  createGuestUser
}
