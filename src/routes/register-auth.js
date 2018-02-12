'use strict'

const express = require('express')
const validate = require('validate.js')
const servLog = require('../services/log')
const RegisterAuthConstraints = require('../validate/constraints/register-auth')
const Charity = require('../models/charity')  // @todo - factory
const UserFactory = require('../models/user-factory')
const UserStates = require('../data/user-states')
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

    // @todo
    // Parse the validation result for a more helpful error message for the user
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json({ message: 'Register details failed data validation' })
    return
  }

  servLog.info({ schema: req.body }, 'Register details passed data validation')
  return next()
})

// Checks to ensure the user does not already exist
router.post('/', async (req, res, next) => {
  // Partially hydrate a User object from the schema
  res.locals.user = UserFactory.createUser(req.body, UserFromRegisterAuthMapping)

  try {
    // Attempt to find the user in the dbase
    const existingUser = await req.app.get('servDb').getUserActions().find(res.locals.user)
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

// Wraps the User-Charity-Creation saga
router.use(async (req, res, next) => {
  try {
    // Store the new user in the database.
    res.locals.user.state = UserStates.PRE_CONFIRMED
    res.locals.user = await req.app.get('servDb').getUserActions().upsert(res.locals.user)
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'New user registered')
  } catch (err) {
    servLog.info({ 
      err: err, 
      user: res.locals.user.toJSONWithoutPassword() }, 
      'Handling error creating a new User')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst adding the new user. Please try again.' })
    return
  }

  // Create a Charity object for the user and store in the search engine
  const servSearch = req.app.get('servSearch')
  let charity = new Charity()
  charity.userId = res.locals.user.id
  try {
    charity = await servSearch.saveNewCharity(charity)
    servLog.info({ charityId: charity.id }, 'New charity added')
    return next()
  } catch (err) {
    servLog.info({ 
      err: err,
      user: res.locals.user.toJSONWithoutPassword() },
      'Handling error creating a new Charity')
  }

  // We failed to create a Charity object. We need to rollback the saga
  try {
    await req.app.get('servDb').getUserActions().remove(res.locals.user)
  } catch (err) {
    servLog.info({ 
      err: err,
      user: res.locals.user.toJSONWithoutPassword() },
      'Failed to rollback User-Charity-Creation saga')
    // We really are in a mess now. The Charity object was not created, and now there
    // was a problem deleting the user. For now, give up. Re-write the saga in future
    // such that failed sagas are logged, for later handling.
  }

  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(500)
  res.json({ message: 'An error occurred whilst adding the new charity. Please wait a moment, then try again' })
  return
})

// @todo here - send registration confirmation email and redirect user
router.use(async (req, res, next) => {
  try {
    // Create json web token from the user object and return
    const token = await req.app.get('libTokens').createToken(res.locals.user)
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
