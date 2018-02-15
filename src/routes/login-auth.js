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
  const data = {
    status: 500,
    message: "Something went wrong, sorry. Please refresh the page and try again."
  }
  handleSubscription(res, data, 'ERROR')
}

const handleSubscription = (res, data, outcome) => {
  deps.logService.info(
    { message: data.message, action: data.action, data: data.data }, 
    `Handling LoginAuthUseCase ${outcome}`)

  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(data.status)
  res.json({ message: data.message, action: data.action, data: data.data })
}

// Router entry point
const handleLoginAuthUseCase = (req, res, next) => {
  const useCase = new deps.LoginAuthUseCase()
  useCase
    .consume('invalid-credentials', (data) => handleSubscription(res, data, 'FAILURE'))
    .consume('user-not-found', (data) => handleSubscription(res, data, 'FAILURE'))
    .consume('user-not-confirmed', (data) => handleSubscription(res, data, 'FAILURE'))
    .consume('user-password-incorrect', (data) => handleSubscription(res, data, 'FAILURE'))
    .catch((err) => handleSubscriptionError(res, err))
    .consume('user-token-created', (data) => handleSubscription(res, data, 'SUCCESS'))
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
