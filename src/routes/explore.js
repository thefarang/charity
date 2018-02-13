'use strict'

const express = require('express')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const servLog = req.app.get('servLog')
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
    seo: req.app.get('libSeo')('/explore'),
    route: '/explore',
    user: res.locals.user,
    causes: causes
  })
})

module.exports = router
