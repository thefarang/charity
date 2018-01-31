'use strict'

const bearerToken = require('bearer-token')
const jwt = require('jsonwebtoken')
const dbUsers = require('../data/users')
const acl = require('../data/acl')

const createToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.name
      },
      'secret', // @todo critical - Replace the 'secret' with a pass phrase stored in the config
      {
        expiresIn: '1h' // @todo - put this into config
      },
      (err, token) => {
        if (err) {
          // @todo - add logging
          return reject(err)
        }
        return resolve(token)
      }
    )
  })
}

const getToken = async (req) => {
  return new Promise((resolve, reject) => {
    bearerToken(req, (err, token) => {
      if (err) {
        // @todo - add logging
        return reject(err)
      }
      return resolve(token)
    })
  })
}

const getUserByToken = async (token) => {
  return new Promise((resolve, reject) => {
    // @todo critial - Parameterise
    jwt.verify(token, 'secret', (err, decodedUser) => {
      if (err) {
        // @todo - add logging
        return reject(err)
      }
      return resolve(decodedUser)
    })
  })
}

const getGuestUser = () => dbUsers.getGuestUser()

const getUserACLByRole = (role) => {
  const completeAcl = acl.getAcl()
  let userAcl = []

  for (const index in completeAcl) {
    if (completeAcl[index].roles.indexOf(role.name) >= 0) {
      userAcl.push(completeAcl[index])
    }
  }
  return userAcl
}

// @todo
// This must be changed
/*
const isUserAuthorised = (resource, permission, acl) => {
  let isAuthorised = false
  for (const index in acl) {
    if ((acl[index].resource === resource) && (acl[index].permission === permission)) {
      isAuthorised = true
      break
    }
  }
  return isAuthorised
}
*/
const isUserAuthorised = (resource, permission, role) => {
  let isAuthorised = false
  const completeAcl = acl.getAcl()

  for (const index in completeAcl) {
    if ((completeAcl[index].resource === resource) && (completeAcl[index].permission === permission)) {
      // We have found the resource the user wants to access. Now check they are
      // allowed to access it.
      if (completeAcl[index].roles.indexOf(role.name) >= 0) {
        isAuthorised = true
      }
      break
    }
  }
  return isAuthorised
}

module.exports = {
  createToken,
  getGuestUser,
  getToken,
  getUserACLByRole,
  getUserByToken,
  isUserAuthorised
}
