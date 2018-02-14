'use strict'

const express = require('express')
const validate = require('validate.js')
const libTokens = require('../lib/tokens')
const servLog = require('../services/log')
const CauseFactory = require('../factories/cause-factory')
const UserFactory = require('../factories/user-factory')
const UserStates = require('../data/user-states')
const RegisterAuthConstraints = require('../validate/constraints/register-auth')
const UserFromRegisterAuthMapping = require('../validate/mappings/user-from-register-auth')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {
  const validationResult = validate(req.body, RegisterAuthConstraints)
  if (validationResult) {
    servLog.info({ 
      schema: req.body,
      validationResult: validationResult },
      'Register details failed data validation')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json(validationResult)
    return
  }
  servLog.info({ schema: req.body }, 'Register details passed data validation')
  return next()
})

// Checks to ensure the user does not already exist
router.post('/', async (req, res, next) => {
  const servDb = req.app.get('servDb')

  try {
    // Attempt to find the user in the dbase
    res.locals.user = UserFactory.createUser(req.body, UserFromRegisterAuthMapping)
    const existingUser = await servDb.getUserActions().find(res.locals.user)
    if (existingUser) {
      servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'Existing user attempting registration')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(404)
      res.json({ message: 'Email already exists in the system' })
      return
    }
    return next()
  } catch (err) {
    servLog.info({ 
      err: err,
      user: res.locals.user.toJSONWithoutPassword() },
      'Handling error searching for a matching user')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred. Please try again.' })
    return
  }
})

// Wraps the User-Cause-Creation saga
router.use(async (req, res, next) => {
  const servDb = req.app.get('servDb')
  const servSearch = req.app.get('servSearch')

  try {
    // Store the new user in the database.
    res.locals.user.state = UserStates.PRE_CONFIRMED
    res.locals.user = await servDb.getUserActions().upsert(res.locals.user)
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'New user registered')
  } catch (err) {
    servLog.info({ 
      err: err, 
      user: res.locals.user.toJSONWithoutPassword() }, 
      'Handling error creating a new User')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'Error occurred adding new user. Please try again.' })
    return
  }

  try {
    // Create a Cause object for the user and store in the search engine
    const cause = await servSearch.saveNewCause(CauseFactory.createCauseByUserId(res.locals.user.id)) 
    servLog.info({ cause: cause }, 'New cause added')
    return next()
  } catch (err) {
    servLog.info({ 
      err: err,
      user: res.locals.user.toJSONWithoutPassword() },
      'Handling error creating a new Cause')
  }

  // We failed to create a Cause object. We need to rollback the saga
  try {
    await req.app.get('servDb').getUserActions().remove(res.locals.user)
  } catch (err) {
    servLog.info({ 
      err: err,
      user: res.locals.user.toJSONWithoutPassword() },
      'Failed to rollback User-Cause-Creation saga')
    // We really are in a mess now. The Cause object was not created, and now there
    // was a problem deleting the user. For now, give up. Re-write the saga in future
    // such that failed sagas are logged, for later handling.
  }

  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(500)
  res.json({ message: 'An error occurred whilst adding the new Cause. Please wait a moment, then try again' })
  return
})

router.use(async (req, res, next) => {
  try {
    // Create json web token from the user object and return
    const token = await libTokens.createToken(res.locals.user)
    servLog.info({ 
      user: res.locals.user.toJSONWithoutPassword(), 
      token: token }, 'Created token for new user')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    req.app.get('libCookies').setCookie(res, token)
    res.status(200)
    res.json({ loc: '/dashboard/cause' })
  } catch (err) {
    servLog.info({
      user: res.locals.user.toJSONWithoutPassword() },
      'Handling the error that occurred whilst creating a newly registered user token')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'Failed to authorise user. Please attempt to login.' })
  }
})

module.exports = router
