'use strict'

const mongoose = require('mongoose')
const servLog = require('../../../log')
const UserSchema = require('../schema/user-schema')
const UserFactory = require('../../../../factories/user-factory')
const UserFromDbUserMapping = require('../mappings/user-from-db-user')

const ObjectId = mongoose.Types.ObjectId

const findUser = async (user) => {
  const search = (user.id) ? { _id: user.id } : { user_email: user.email }
  const userSchema = await _findOne(search)
  if (!userSchema) {
    return null
  }

  user.update(UserFactory.createUser(userSchema, UserFromDbUserMapping))
  return user
}

const _findOne = (searchSchema) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne(searchSchema, (err, userSchema) => {
      if (err) {
        servLog.info({ err: err, searchSchema: searchSchema }, 'Error locating existing User document')
        return reject(err)
      }
      return resolve(userSchema)
    })
  })
}

const upsertUser = async (user) => {
  try {
    let userSchema = (user.id) ? await _findOne({ _id: user.id }) : await _findOne({ user_email: user.email })
    userSchema = userSchema || new UserSchema()
    return await _upsert(user, userSchema)
  } catch (err) {
    throw err
  }
}

const _upsert = (user, userSchema) => {
  return new Promise(async (resolve, reject) => {
    userSchema.user_state = user.state
    userSchema.user_email = user.email
    userSchema.user_encrypted_password = user.password.encryptedPassword
    if (user.password.clearPassword) {
      // Rebuild the encrypted password
      userSchema.user_encrypted_password = await user.password.getEncPasswordFromClearPassword(user.password.clearPassword)
    }
    userSchema.user_role = user.role
    userSchema.save((err) => {
      if (err) {
        servLog.info({ err: err, user: user.toJSONWithoutPassword() }, 'Error saving the UserSchema')
        return reject(err)
      }

      // Add the values that would be missing from a new User
      // prior to persistence, and the (possibly updated)
      // user_encrypted_password.
      user.update(UserFactory.createUser(userSchema, UserFromDbUserMapping))
      return resolve(user)
    })
  })
}

const removeUser = (user) => {
  return new Promise((resolve, reject) => {
    UserSchema.remove({ _id: user.id }, (err) => {
      if (err) {
        servLog.info({ err: err, user: user.toJSONWithoutPassword() }, 'Error whilst deleting user')
        return reject(err)
      }
      return resolve()
    })
  })
}

module.exports = {
  findUser,
  upsertUser,
  removeUser
}
