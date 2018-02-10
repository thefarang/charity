'use strict'

const express = require('express')

const servLog = require('../services/log')

const router = express.Router()

router.get('/', async (req, res, next) => {
  // Load the charity objects
  const servSearch = req.app.get('servSearch')
  let charities = null
  try {
    charities = await servSearch.search()
    servLog.info({ noOfCharitiesFound: charities.length }, `Charities found in default search`)
  } catch (err) {
    servLog.info({ user: res.locals.user.toSecureSchema() }, 'Handling error finding charity list')
    return next(err)
  }

  res.render('explore', {
    seo: req.app.get('libSeo')('/explore'),
    route: '/explore',
    user: res.locals.user,
    charities: charities
  })
})

module.exports = router
