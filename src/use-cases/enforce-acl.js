'use strict'

const Action = require('oja').Action

const deps = {
  IdentifyUserPolicy: null,
  CheckRouteAuthorisationPolicy: null,
  RedirectToAuthRoutePolicy: null
}

class EnforceACLUseCase extends Action  {
  constructor() {
    super()
    this.add(
      new deps.IdentifyUserPolicy(),
      new deps.CheckRouteAuthorisationPolicy(),
      new deps.RedirectToAuthRoutePolicy())
  }
}

module.exports = (IdentifyUserPolicy, CheckRouteAuthorisationPolicy, RedirectToAuthRoutePolicy) => {
  deps.IdentifyUserPolicy = IdentifyUserPolicy
  deps.CheckRouteAuthorisationPolicy = CheckRouteAuthorisationPolicy
  deps.RedirectToAuthRoutePolicy = RedirectToAuthRoutePolicy
  return EnforceACLUseCase
}
