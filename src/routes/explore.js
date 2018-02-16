/*
'use strict'

const express = require('express')
const libSeo = require('../lib/seo')
const servLog = require('../services/log')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const servSearch = req.app.get('servSearch')

  let causes = null
  try {
    causes = await servSearch.search()
    servLog.info({ noOfCausesFound: causes.length }, `Causes found in default search`)
  } catch (err) {
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'Handling error finding cause list')
    return next(err)
  }

  res.render('explore', {
    seo: libSeo('/explore'),
    route: '/explore',
    user: res.locals.user,
    causes: causes
  })
})

module.exports = router
*/



'use strict'

const express = require('express')

const deps = {
  logService: null,
  seoLibrary: null,
  ExploreCausesUseCase: null,
  ExploreCausesUseCaseContext: null
}

const handleSubscriptionSuccess = (res, context) => {
  console.log('hererererer')
  res.render('explore', {
    seo: deps.seoLibrary('/explore'),
    route: '/explore',
    user: context.user,
    causes: context.causes
  })
}

const handleExploreCausesUseCase = (req, res, next) => {
  console.log('HERE1')
  const useCase = new deps.ExploreCausesUseCase()
  useCase
    .consume('cause-search-complete', (context) => handleSubscriptionSuccess(res, context))
    .catch((err) => next(err))
    .define('context', new deps.ExploreCausesUseCaseContext(req, res))
    .activate()
    
}

module.exports = (logService, seoLibrary, ExploreCausesUseCase, ExploreCausesUseCaseContext) => {
  deps.logService = logService
  deps.seoLibrary = seoLibrary
  deps.ExploreCausesUseCase = ExploreCausesUseCase
  deps.ExploreCausesUseCaseContext = ExploreCausesUseCaseContext

  const router = express.Router()
  router.use((req, res, next) => handleExploreCausesUseCase(req, res, next))
  return router
}

