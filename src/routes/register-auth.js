'use strict'

const express = require('express')
const validate = require('validate.js')
const servLog = require('../services/log')
const RegisterAuthConstraints = require('../validate/constraints/register-auth')
const Charity = require('../models/charity')  // @todo - factory
const UserFactory = require('../models/user-factory')

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

router.post('/', async (req, res, next) => {

  // Partially hydrate a User object from the schema
  let user = UserFactory.createFromSchema(req.body)

  try {
    // Attempt to find the user in the dbase
    const existingUser = await req.app.get('servDb').getUserActions().find(user)
    if (existingUser) {
      servLog.info({ user: user.toSecureSchema() }, 'Existing user attempting registration')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(404)
      res.json({ message: 'Email already exists in the system' })
      return
    }
  } catch (err) {
    servLog.info({ user: user.toSecureSchema() }, 'Handling error searching for a matching user')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred. Please try again.' })
    return
  }

  try {
    // Store the new user in the database.
    await req.app.get('servDb').getUserActions().upsert(user)
    servLog.info({ user: user.toSecureSchema() }, 'New user registered')
  } catch (err) {
    servLog.info({ err: err, user: user.toSecureSchema() }, 'Handling error creating a new User')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst adding the new user. Please try again.' })
    return
  }

  // @todo - create factory
  // Create a Charity object for the user and store in the search engine
  const servSearch = req.app.get('servSearch')
  let charity = new Charity()
  charity.userId = user.id
  try {
    charity = await servSearch.saveNewCharity(charity)
    servLog.info({ charityId: charity.id }, 'New charity added')
  } catch (err) {
    // @todo critical
    // If this fails, the user will not have a charity. What happens?
    servLog.info({ user: user.toSecureSchema() }, 'Handling error creating a new Charity')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst adding the new charity.' })
    return
  }

  // @todo - this occurs in login-auth too, so share this code
  try {
    // Create json web token from the user object and return
    const token = await req.app.get('libTokens').createToken(user)
    servLog.info({ user: user.toSecureSchema(), token: token }, 'Created token for new user')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    req.app.get('libCookies').setCookie(res, token)
    res.status(200)

    // @todo HERE redirect to appropriate dashboard
    res.json({ loc: '/dashboard/charity' })
  } catch (err) {
    servLog.info({
      user: user.toSecureSchema() },
      'Handling the error that occurred whilst creating a newly registered user token')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'Failed to authorise user. Please attempt to login.' })
  }
})

module.exports = router
