'use strict'

const express = require('express')

const deps = {
  logService: null,
  seoLibrary: null,
  EnforceACLUseCase: null,
  EnforceACLUseCaseContext: null
}

const handleSubscriptionSuccess = (res, context) => {
  res.render('index', {
    seo: deps.seoLibrary('/'),
    route: '/',
    user: context.user
  })
}

const handleIndexUseCase = (req, res, next) => {
  console.log('IN THE INDEX USE CASE')
  const useCase = new deps.EnforceACLUseCase()
  useCase
    .consume('user-authorised', (context) => handleSubscriptionSuccess(res, context))
    .catch((err) => next(err))
    .define('context', new deps.EnforceACLUseCaseContext(req, res))
    .activate()
}

module.exports = (logService, seoLibrary, EnforceACLUseCase, EnforceACLUseCaseContext) => {
  deps.logService = logService
  deps.seoLibrary = seoLibrary
  deps.EnforceACLUseCase = EnforceACLUseCase
  deps.EnforceACLUseCaseContext = EnforceACLUseCaseContext

  const router = express.Router()
  router.use((req, res, next) => handleIndexUseCase(req, res, next))
  return router
}
