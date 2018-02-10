'use strict'

const express = require('express')

const servLog = require('../../services/log')

const router = express.Router()

router.get('/', async (req, res, next) => {
  // Load the charity object
  const servSearch = req.app.get('servSearch')
  let charity = null
  try {
    charity = await servSearch.findCharityByUserId(res.locals.user.id)
    servLog.info({ charity: charity.toJSON() }, `Charity found from user id: ${res.locals.user.id}`)
  } catch (err) {

    servLog.info({
      userId: res.locals.user.id },
      "Handling error finding the User's Charity object")
    return next(err)
  }

  res.render('dashboard/charity', {
    seo: req.app.get('libSeo')('/dashboard/charity'),
    route: '/dashboard/charity',
    user: res.locals.user,
    charity: charity
  })
})

module.exports = router
