'use strict'

const mongoose = require('mongoose')

const servLog = require('../../log')
const UserSchema = require('../schema/user-schema')

const User = require('../../../models/user')
const Role = require('../../../models/role')
const Password = require('../../../models/password')

const ObjectId = mongoose.Types.ObjectId

/*
// @todo
const findUserById = (id) => {
  console.log('findUserById() - Not yet implemented')
}
*/

// @todo
// Remember that a User object hydrated from the Token will not have a
// User.Password object. So update to support that.
const _upsert = (user, userSchema, resolve, reject) => {
  if (user.id) {
    userSchema._id = new ObjectId(user.id)
  }

  userSchema.email = user.email

  if (!userSchema.encPassword) {
    // No encoded password has been previously stored, so update this field.
    userSchema.encPassword = user.password.encPassword
  } else if (user.password.encPassword !== userSchema.encPassword) {
    // The encoded password has been previously stored and has now changed.
    userSchema.encPassword = user.password.encPassword
  }

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
}

const saveUser = (user) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne({ _id: user.id }, (err, userSchema) => {
      if (err) {
        servLog.info({
          err: err,
          user: user
        }, 'An error occurred locating the existing User document')
        return reject(err)
      }

      userSchema = userSchema || new UserSchema()
      _upsert(user, userSchema, resolve, reject)
    })
  })
}

const findUserByEmail = (sanitizedEmail) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne({ email: sanitizedEmail }, (err, userSchema) => {
      if (err) {
        servLog.info({
          err: err,
          email: sanitizedEmail
        }, `An error occurred locating UserSchema`)
        return reject(err)
      }

      let user = null
      if (userSchema !== null) {
        // Transform the mongo UserSchema object into a User object
        const password = new Password()
        password.encPassword = userSchema.encPassword

        user = new User()
        user.id = userSchema._id
        user.email = userSchema.email
        user.password = password
        user.role = new Role(userSchema.role.id, userSchema.role.name)
      }
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
  findUserByEmail,
  saveUser
  /*
  findUserById,
  removeUser
  */
}
