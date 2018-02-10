'use strict'

const mongoose = require('mongoose')

const servLog = require('../../log')
const UserSchema = require('../schema/user-schema')
const UserFactory = require('../../../models/user-factory')
const PasswordFactory = require('../../../models/password-factory')

const ObjectId = mongoose.Types.ObjectId

const find = async (user) => {
  const userSchema = await findOne({ user_email: user.email })
  if (!userSchema) {
    return null
  }

  const newUser = UserFactory.createFromSchema(userSchema)
  newUser.update({
    user_id: userSchema._id,
    user_password: user.password.clearPassword
  })
  return newUser
}

const findOne = (searchSchema) => {
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

const upsert = (user) => {
  return new Promise(async (resolve, reject) => {
    const userSchema = new UserSchema()
    if (user.id) {
      userSchema._id = new ObjectId(user.id)
    }
    userSchema.user_email = user.email
    userSchema.user_encrypted_password = 
      await user.password.getEncPasswordFromClearPassword(user.password.clearPassword)
    userSchema.user_role_id = user.role.id
    userSchema.user_role_name = user.role.name
    userSchema.save((err) => {
      if (err) {
        servLog.info({ err: err, user: user.toSecureSchema() }, 'Error saving the UserSchema')
        return reject(err)
      }

      // Add the values that would be missing from a new User
      // prior to persistence. Add the (possibly updated)
      // user_encrypted_password.
      user.update({
        user_id: userSchema._id.valueOf(),
        user_encrypted_password: userSchema.user_encrypted_password
      })
      return resolve(user)
    })
  })
}

/*
const removeUser = (user) => {
  return new Promise((resolve, reject) => {
    UserSchema.remove({ _id: user.id }, (err) => {
      if (err) {
        servLog.info({
          err: err,
          user: user
        }, 'An error occurred whilst deleting UserSchema')
        return reject(err)
      }
      return resolve()
    })
  })
}
*/

module.exports = {
  find,
  upsert
}
