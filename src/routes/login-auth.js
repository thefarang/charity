'use strict'

const express = require('express')

const deps = {
  logService: null,
  LoginAuthConstraints: null,
  UserFromLoginAuthMapping: null,
  LoginAuthUseCase: null,
  UseCaseContext: null
}

const handleSubscriptionError = (err, res) => {
  // @todo UGLY, refactor the UseCaseContext class
  const context = new UseCaseContext(null, null, null, null)
  context.status = 500
  context.message = "Something went wrong, sorry. Please refresh the page and try again."
  handleSubscription(res, context, 'ERROR')
}

const handleSubscription = (res, context, outcome) => {
  deps.logService.info(
    { message: context.message, action: context.action, data: context.data }, 
    `Handling LoginAuthUseCase ${outcome}`)

  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(context.status)
  res.json({ message: context.message, action: context.action, data: context.data })
}

// Router entry point
const handleLoginAuthUseCase = (req, res, next) => {
  const useCase = new deps.LoginAuthUseCase()
  useCase
    .consume('invalid-credentials', (context) => handleSubscription(res, context, 'FAILURE'))
    .consume('user-not-found', (context) => handleSubscription(res, context, 'FAILURE'))
    .consume('user-not-confirmed', (context) => handleSubscription(res, context, 'FAILURE'))
    .consume('user-password-incorrect', (context) => handleSubscription(res, context, 'FAILURE'))
    .catch((err) => handleSubscriptionError(res, err))
    .consume('user-token-created', (context) => handleSubscription(res, context, 'SUCCESS'))
    .define('context', new deps.UseCaseContext(
      req.body, deps.LoginAuthConstraints, deps.UserFromLoginAuthMapping, res
    ))
    .activate()
}

module.exports = (logService, LoginAuthConstraints, UserFromLoginAuthMapping, LoginAuthUseCase, UseCaseContext) => {
  deps.logService = logService
  deps.LoginAuthConstraints = LoginAuthConstraints
  deps.UserFromLoginAuthMapping = UserFromLoginAuthMapping
  deps.LoginAuthUseCase = LoginAuthUseCase
  deps.UseCaseContext = UseCaseContext

  const router = express.Router()
  router.use((req, res, next) => handleLoginAuthUseCase(req, res, next))
  return router
}
