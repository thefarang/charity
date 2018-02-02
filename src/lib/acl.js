'use strict'

const dACL = require('../data/acl')

const isUserAuthorised = (resource, permission, role) => {
  let isAuthorised = false
  const completeAcl = dACL.getAcl()

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
  isUserAuthorised
}
