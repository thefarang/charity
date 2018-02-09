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

    servLog.info({
      userId: req.user.id },
      "Handling error finding charity list")
    return next(err)
  }

  res.render('explore', {
    seo: req.libSeo('/explore'),
    route: '/explore',
    user: req.user,
    charities: charities
  })
})

module.exports = router
