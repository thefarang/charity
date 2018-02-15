'use strict'

const Action = require('oja').Action

const deps = {
  UserRoles: null
}

class RedirectToAuthRoutePolicy extends Action {
  async execute () {
    const context = await this.consume('user-not-authorised')
    context.status = 302
    context.action = 'redirect'

    if (context.user.role === deps.UserRoles.GUEST) {
      context.data = '/login'
    } else {
      switch (context.user.role) {
        case UserRoles.ADMIN: context.data = '/dashboard/admin'; break
        case UserRoles.CAUSE: context.data = '/dashboard/cause'; break
        default: context.data = '/dashboard/donator'
      }
    }

    deps.logService.info({ 
      status: context.status, action: context.action, data: context.data }, 
      'Applying RedirectToAuthRoutePolicy')
    context.res.redirect(context.status, context.data)
  }
}

module.exports = (UserRoles) => {
  deps.UserRoles = UserRoles
  return RedirectToAuthRoutePolicy
}
