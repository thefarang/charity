'use strict'

const express = require('express')
const CauseFactory = require('../../factories/cause-factory')
const CauseAuthSchema = require('../../validate/schema/cause-auth')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const servSearch = req.app.get('servSearch')
  const servLog = req.app.get('servLog')

  let cause = null
  try {
    cause = await servSearch.findCauseByUserId(res.locals.user.id)
    if (cause) {
      servLog.info({ cause: cause.toJSON() }, `Cause found from user id: ${res.locals.user.id}`)
    } else {
      servLog.info({}, 'Using empty cause')
      cause = CauseFactory.createEmptyCause()
    }
  } catch (err) {
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'Handling error finding the Users Cause')
    return next(err)
  }

  res.render('dashboard/cause', {
    seo: req.app.get('libSeo')('/dashboard/cause'),
    route: '/dashboard/cause',
    user: res.locals.user,
    cause: cause,
    CauseAuthSchema: CauseAuthSchema
  })
})

module.exports = router
