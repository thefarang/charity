'use strict'

const express = require('express')

const servLog = require('../../services/log')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const servSearch = req.app.get('servSearch')
  let charity = null
  try {
    charity = await servSearch.findCharityByUserId(res.locals.user.id)
    servLog.info({ charity: charity.toJSON() }, `Charity found from user id: ${res.locals.user.id}`)
  } catch (err) {
    servLog.info({ user: req.locals.user.toJSONWithoutPassword() }, 'Handling error finding the Users Charity')
    return next(err)
  }

  res.render('dashboard/cause', {
    seo: req.app.get('libSeo')('/dashboard/cause'),
    route: '/dashboard/cause',
    user: res.locals.user,
    charity: charity
  })
})

module.exports = router
