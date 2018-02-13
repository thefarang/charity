'use strict'

const express = require('express')
const validate = require('validate.js')
const CauseFactory = require('../../factories/cause-factory')
const CauseAuthConstraints = require('../../validate/constraints/cause-auth')
const CauseFromCauseAuthMapping = require('../../validate/mappings/cause-from-cause-auth')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {
  const servLog = req.app.get('servLog')

  const validationResult = validate(req.body, CauseAuthConstraints)
  if (validationResult) {
    servLog.info({ 
      schema: req.body,
      validationResult: validationResult },
      'Cause details failed data validation')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json(validationResult)
    return
  }

  servLog.info({ schema: req.body }, 'Cause details passed data validation')
  return next()
})

router.post('/', async (req, res, next) => {
  const servLog = req.app.get('servLog')
  const servSearch = req.app.get('servSearch')
  
  let cause = null
  try {
    cause = await servSearch.findCauseByUserId(res.locals.user.id)
    if (!cause) {
      servLog.info({
        user: res.locals.user.toJSONWithoutPassword() },
        'User does not have an associted cause')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(500)
      res.json({ message: 'User does not have an associted cause' })
      return
    }
  } catch (err) {
    servLog.info({
      user: res.locals.user.toJSONWithoutPassword() },
      'Handling error searching for a matching Cause')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred. Please try again.' })
    return
  }

  try {
    // Update cause and store in search
    cause.update(CauseFactory.createCause(req.body, CauseFromCauseAuthMapping))
    await servSearch.updateCause(cause)
    servLog.info({ cause: cause.toJSON() }, 'Cause details updated')
  } catch (err) {
    servLog.info({
      err: err,
      cause: cause.toJSON() },
      'Handling error updating a Cause')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst updating the Cause. Please try again.' })
    return
  }

  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json()
})

module.exports = router
