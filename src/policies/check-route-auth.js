'use strict'

const Action = require('oja').Action

const deps = {
  logService: null,
  aclLibrary: null
}

class CheckRouteAuthorisationPolicy extends Action {
  async execute () {
    const context = await this.consume('user-identified')

    if (!deps.aclLibrary.isUserAuthorised(context.req.path, context.req.method.toLowerCase(), context.user.role)) {
      deps.logService.info({
        user: context.user.toJSONWithoutPassword(),
        resource: context.req.path
        }, 'User attempted to access unauthorised route.')
      this.define('user-not-authorised', context)
      return
    }

    this.define('user-authorised', context)
  }
}

module.exports = (logService, aclLibrary) => {
  deps.logService = logService
  deps.aclLibrary = aclLibrary
  return CheckRouteAuthorisationPolicy
}
