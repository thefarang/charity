'use strict'

const ACL = require('../data/acl')

/*
const isResourceExistant = (resource) => {
  let isExistant = false
  const completeAcl = aclDataHelper.getAclSchema()
  for (const index in completeAcl) {
    if (completeAcl[index].resource === resource) {
      isExistant = true
      break
    }
  }
  return isExistant
}
*/
const isResourceExistant = (resource) => {
  let isExistant = false

  for (let accessControl in ACL) {
    if (ACL[accessControl].resource === resource) {
      isExistant = true
      break
    }
  }

  return isExistant
}

/*
const isUserAuthorised = (resource, permission, role) => {
  let isAuthorised = false
  const completeAcl = aclDataHelper.getAclSchema()

  for (const index in completeAcl) {
    if ((completeAcl[index].resource === resource) && (completeAcl[index].permission === permission)) {
      // We have found the resource the user wants to access. Now check they are
      // allowed to access it.
      if (completeAcl[index].roles.indexOf(role) >= 0) {
        isAuthorised = true
      }
      break
    }
  }
  return isAuthorised
}
*/

const isUserAuthorised = (resource, permission, role) => {
  let isAuthorised = false

  for (let accessControl in ACL) {
    if ((ACL[accessControl].resource === resource) && (ACL[accessControl].permission === permission)) {
      // We have found the resource the user wants to access. Now check they are
      // allowed to access it.
      if (ACL[accessControl].roles.indexOf(role) >= 0) {
        isAuthorised = true
      }
      break
    }
  }
  return isAuthorised
}

module.exports = {
  isResourceExistant,
  isUserAuthorised
}
