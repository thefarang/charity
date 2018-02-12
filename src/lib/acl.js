'use strict'

const aclDataHelper = require('../data/acl')

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

module.exports = {
  isResourceExistant,
  isUserAuthorised
}
