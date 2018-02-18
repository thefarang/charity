'use strict'

const express = require('express')
const libSeo = require('../lib/seo')
const servLog = require('../services/log')

const router = express.Router()

// Lists all causes, or causees filtered by keywords on
// the query string.
router.get('/', async (req, res, next) => {
  const servSearch = req.app.get('servSearch')

  // @todo Use the sort query
  let causes = null
  try {
    if (req.query.keyword) {
      causes = await servSearch.searchFilteredCauses(req.query.keyword, req.query.sort)
      servLog.info({ noOfCausesFound: causes.length }, `Causes found in filtered search`)
    } else {
      // @todo implement sort here too
      causes = await servSearch.search()
      servLog.info({ noOfCausesFound: causes.length }, `Causes found in default search`)
    }
  } catch (err) {
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'Handling error finding cause list')
    return next(err)
  }

  res.render('explore', {
    seo: libSeo('/explore'),
    route: '/explore',
    user: res.locals.user,
    causes: causes,
    keyword: req.query.keyword || '',
    sort: req.query.sort || null
  })
})

module.exports = router
