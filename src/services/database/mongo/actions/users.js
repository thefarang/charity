'use strict'

const mongoose = require('mongoose')

const servLog = require('../../../log')
const UserSchema = require('../schema/user-schema')
const UserFactory = require('../../../../models/user-factory')
const UserFromDbUserMapping = require('../mappings/user-from-db-user')

const ObjectId = mongoose.Types.ObjectId

const find = async (user) => {
  const userSchema = await findOne({ user_email: user.email })
  if (!userSchema) {
    return null
  }

  const newUser = UserFactory.createUser(userSchema, UserFromDbUserMapping)
  newUser.password.clearPassword = user.password.clearPassword
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

// Search based on
const upsert = async (user) => {
  try {
    let userSchema = null
    if (user.id) {
      userSchema = await findOne({ _id: user.id })
    } else if (user.email) {
      userSchema = await findOne({ user_email: user.email })
    }
    
    if (!userSchema) {
      userSchema = new UserSchema()
    }
    return await _upsert(user, userSchema)
  } catch (err) {
    throw err
  }
}

const _upsert = (user, userSchema) => {
  return new Promise(async (resolve, reject) => {
    userSchema.user_email = user.email
    userSchema.user_encrypted_password = 
      await user.password.getEncPasswordFromClearPassword(user.password.clearPassword)
    userSchema.user_role = user.role
    userSchema.save((err) => {
      if (err) {
        servLog.info({ err: err, user: user.toJSONWithoutPassword() }, 'Error saving the UserSchema')
        return reject(err)
      }

      // Add the values that would be missing from a new User
      // prior to persistence. Add the (possibly updated)
      // user_encrypted_password.
      user.id = userSchema._id.valueOf()
      user.password.encryptedPassword = userSchema.user_encrypted_password
      return resolve(user)
    })
  })
}

const remove = (user) => {
  return new Promise((resolve, reject) => {
    UserSchema.remove({ _id: user.id }, (err) => {
      if (err) {
        servLog.info({
          err: err,
          user: user.toJSONWithoutPassword()
        }, 'Errored whilst deleting user')
        return reject(err)
      }
      return resolve()
    })
  })
}

module.exports = {
  find,
  upsert,
  remove
}
