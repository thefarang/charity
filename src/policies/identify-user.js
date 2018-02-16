'use strict'

const Action = require('oja').Action

const deps = {
  logService: null,
  jwtLibrary: null,
  cookiesLibrary: null,
  UserFactory: null
}

class IdentifyUserPolicy extends Action {
  constructor(consumeTopic, publishTopicSuccess, publicTopicFail) {
    // consumeTopic === 'context'
    // publishTopicSuccess = 'user-identified'
    // publicTopicFail = null
    super()
  }

  async execute () {
    const context = await this.consume('context')

    // Set the user as guest by default
    let user = deps.UserFactory.createGuestUser()
    const token = deps.jwtLibrary.getJWToken(context.req)
    if (token) {
      deps.logService.info({ token: token }, 'Token found')
      const userFromToken = await deps.jwtLibrary.getUserByJWToken(token)
      if (userFromToken) {
        user = userFromToken
      } else {
        deps.logService.info({ token: token }, 'Token has expired.')
        deps.cookiesLibrary.unsetCookie(res)
      }
    }

    context.user = user
    this.define('user-identified', context)
  }
}

module.exports = (logService, jwtLibrary, cookiesLibrary, UserFactory) => {
  deps.logService = logService
  deps.jwtLibrary = jwtLibrary
  deps.cookiesLibrary = cookiesLibrary
  deps.UserFactory = UserFactory
  return IdentifyUserPolicy
}
