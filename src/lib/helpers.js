'use strict'

const bearerToken = require('bearer-token')
const jwt = require('jsonwebtoken')
const dbUsers = require('../data/users')
const acl = require('../data/acl')

const getGuestUser = () => dbUsers.getGuestUser()

const getToken = async (req) => {
  return new Promise((resolve, reject) => {
    bearerToken(req, (err, token) => {
      if (err) {
        // @todo Error 500
        return reject(err)
      }

      return resolve(token)
    })
  })
}

/*
async function getUserByToken (token) {
  return new Promise((resolve, reject) => {
    // @todo - Parameterise
    jwt.verify(token, 'secret', (err, decodedUser) => {
      if (err) {
          // @todo 403
        return reject(err)
      }
      return resolve(decodedUser)
    })
  })
}
*/

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

module.exports = {
  /*
  getUserByToken,
  */
  getGuestUser,
  getToken,
  getUserACLByRole,
  isUserAuthorised
}
