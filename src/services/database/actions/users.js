'use strict'

const mongoose = require('mongoose')

const servLog = require('../../log')
const UserSchema = require('../schema/user-schema')

const User = require('../../../models/user')
const Role = require('../../../models/role')
const Password = require('../../../models/password')

const ObjectId = mongoose.Types.ObjectId

const _upsert = (user, userSchema) => {
  return new Promise((resolve, reject) => {
    if (user.id) {
      userSchema._id = new ObjectId(user.id)
    }

    userSchema.email = user.email
    userSchema.encPassword = user.password.encPassword
    userSchema.role.id = user.role.id
    userSchema.role.name = user.role.name
    userSchema.save((err) => {
      if (err) {
        servLog.info({
          err: err,
          user: user
        }, 'An error occurred saving the UserSchema')
        return reject(err)
      }

      user.id = userSchema._id.valueOf()
      return resolve(user)
    })
  })
}

const saveNewUser = async (user) => {
  try {
    await _upsert(user, new UserSchema())
  } catch (err) {
    // @todo add logging here
  }
}

const updateUser = async (user) => {
  try {
    const userSchema = await findOne({ _id: user.id })
    await _upsert(user, userSchema)
  } catch (err) {
    // @todo add logging here.
  }
}

const findUserByEmail = async (sanitizedEmail) => {
  try {
    const userSchema = await findOne({ email: sanitizedEmail })
    return transformSchemaToModel(userSchema)
  } catch (err) {
    // @todo add logging here.
  }
}

const findUserById = async (id) => {
  try {
    const userSchema = await findOne({ _id: id })
    return transformSchemaToModel(userSchema)
  } catch (err) {
    // @todo add logging here.
  }
}

const transformSchemaToModel = (userSchema) => {
  let user = null
  if (userSchema !== null) {
    user = new User()
    user.id = userSchema._id
    user.email = userSchema.email
    const password = new Password()
    password.encPassword = userSchema.encPassword
    user.password = password
    user.role = new Role(userSchema.role.id, userSchema.role.name)
  }
  return user
}

const findOne = (keyValuePairs) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne(keyValuePairs, (err, userSchema) => {
      if (err) {
        servLog.info({
          err: err,
          user: user
        }, 'An error occurred locating the existing User document')
        return reject(err)
      }
      return resolve(userSchema)
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
  findUserByEmail,
  findUserById,
  saveNewUser,
  updateUser
}
