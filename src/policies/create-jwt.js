'use strict'

const Action = require('oja').Action

const deps = {
  logService: null,
  jwtLibrary: null,
  cookiesLibrary: null
}

class CreateJWTPolicy extends Action {
  async execute () {
    // Begin processing when we receive a newly authenticated user.
    const context = await this.consume('user-authentication-success')
    const user = context.user

    const token = await deps.jwtLibrary.createJWToken(user)
    deps.logService.info({ user: user.toJSONWithoutPassword(), token: token }, 'Successfully created token')
    deps.cookiesLibrary.setCookie(context.res, token)

    context.status = 200
    context.action = 'redirect'
    context.data = '/dashboard/cause'
    this.define('user-token-created', context)
  }
}

module.exports = (logService, jwtLibrary, cookiesLibrary) => {
  deps.logService = logService
  deps.jwtLibrary = jwtLibrary
  deps.cookiesLibrary = cookiesLibrary
  return CreateJWTPolicy
}
