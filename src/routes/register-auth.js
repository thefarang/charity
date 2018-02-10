'use strict'

const express = require('express')
const validate = require('validate.js')

const servLog = require('../services/log')
const dataRoles = require('../data/roles')
const registerAuthSchema = require('../validate/schema/register-auth')
const registerAuthConstraints = require('../validate/constraints/register-auth')

const User = require('../models/user')
const Password = require('../models/password')
const Charity = require('../models/charity')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {

  const schema = registerAuthSchema.buildSchema(req.body)
  const validationResult = validate(schema, registerAuthConstraints)

  if (validationResult) {
    servLog.info({ 
      schema: schema,
      validationResult: validationResult },
      'Register details failed data validation')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json()
    return
  }

  servLog.info({ schema: schema }, 'Register details passed data validation')
  res.locals.schema = schema
  return next()
})

router.post('/', async (req, res, next) => {

  // Attempt to find the user in the dbase
  const servDb = req.app.get('servDb')
  let user = null
  try {
    user = await servDb.getUserActions().findUserByEmail(req.body.email)
  } catch (err) {
    servLog.info({
      email: req.body.email },
      'Handling the error that occurred whilst searching for a matching user')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred. Please try again.' })
    return
  }

  if (user !== null) {
    servLog.info({
      email: req.body.email },
      'User already exists in the dbase. Registration attempt denied.')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(404)
    res.json({ message: 'Email already exists in the system' })
    return
  }

  // Store the new user in the database.
  try {
    user = new User()
    user.email = req.body.email

    const password = new Password()
    password.clrPassword = req.body.password
    password.encPassword = await password.getEncPasswordFromClearPassword(req.body.password)
    user.password = password
    user.role = dataRoles.getCauseRole()

    user = await servDb.getUserActions().saveNewUser(user)
    servLog.info({ user: user.toJSON() }, 'New user registered')
  } catch (err) {
    servLog.info({
      err: err,
      email: req.body.email },
      'Handling the error that occurred whilst creating a new User')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst adding the new user. Please try again.' })
    return
  }

  // Create a Charity object for the user and store in the search engine
  const servSearch = req.app.get('servSearch')
  let charity = new Charity()
  charity.userId = user.id
  try {
    charity = await servSearch.saveNewCharity(charity)
    servLog.info({ userId: charity.userId, charityId: charity.id }, 'New charity added')
  } catch (err) {
    // @todo critical
    // If this fails, the user will not have a charity. What happens?
    servLog.info({
      user: user.toJSON() },
      'Handling the error that occurred whilst creating a new Charity')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst adding the new charity.' })
    return
  }

  // Create json web token from the user object and return
  try {
    const token = await req.app.get('libTokens').createToken(user)
    servLog.info({
      user: user.toJSON(),
      token: token },
      'Successfully created token for newly registered user')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    req.app.get('libCookies').setCookie(res, token)
    res.status(200)

    // @todo HERE redirect to appropriate dashboard
    res.json({ loc: '/dashboard/charity' })
  } catch (err) {
    servLog.info({
      user: user.toJSON() },
      'Handling the error that occurred whilst creating a newly registered user token')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'Failed to authorise user. Please attempt to login.' })
  }
})

module.exports = router
