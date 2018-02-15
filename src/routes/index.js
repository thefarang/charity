'use strict'

const express = require('express')

const deps = {
  logService: null,
  seoLibrary: null,
  EnforceACLUseCase: null,
  ACLUseCaseContext: null
}

const handleSubscriptionSuccess = (res, context) => {
  deps.logService.info({}, 'Handling IndexUseCase SUCCESS')
  res.render('index', {
    seo: deps.seoLibrary('/'),
    route: '/',
    user: context.user
  })
}

const handleIndexUseCase = (req, res, next) => {
  const useCase = new deps.EnforceACLUseCase()
  useCase
    .consume('user-authorised', (context) => handleSubscriptionSuccess(res, context))
    .catch((err) => next(err))
    .define('context', new deps.ACLUseCaseContext(req, res))
    .activate()
}

module.exports = (logService, seoLibrary, EnforceACLUseCase, ACLUseCaseContext) => {
  deps.logService = logService
  deps.seoLibrary = seoLibrary
  deps.EnforceACLUseCase = EnforceACLUseCase
  deps.ACLUseCaseContext = ACLUseCaseContext

  const router = express.Router()
  router.use((req, res, next) => handleIndexUseCase(req, res, next))
  return router
}
