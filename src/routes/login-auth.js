'use strict'

const express = require('express')
const validate = require('validate.js')

const servLog = require('../services/log')
const loginAuthSchema = require('../validate/schema/login-auth')
const loginAuthConstraints = require('../validate/constraints/login-auth')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {

  const schema = loginAuthSchema.buildSchema(req.body)
  const validationResult = validate(schema, loginAuthConstraints)

  if (validationResult) {
    servLog.info({ 
      schema: schema,
      validationResult: validationResult },
      'Login details failed data validation')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json()
    return
  }

  servLog.info({ schema: schema }, 'Login details passed data validation')
  res.locals.schema = schema
  return next()
})

router.post('/', async (req, res, next) => {

  // Attempt to find the user in the dbase
  const servDb = req.app.get('servDb')
  let user = null
  try {
    user = await servDb.getUserActions().findUserByEmail(req.body.email)
    if (!user) {
      servLog.info({
        email: req.body.email },
        'User not found based on email and password search')

      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(404)
      res.json()
      return
    }

    servLog.info({ email: req.body.email }, 'User found in login process')
  } catch (err) {
    servLog.info({
      email: req.body.email },
      'Handling the error that occurred whilst locating the user')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  // Test the password is correct
  try {
    const isPasswordCorrect =
      await user.password.isClearPasswordCorrect(req.body.password, user.password.encPassword)
    if (!isPasswordCorrect) {
      servLog.info({ email: req.body.email }, 'User password is incorrect')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(401)
      res.json()
      return
    }

    // Authentication successful. Update the User.Password object (we do not store
    // the clear text password in the database)
    user.password.clrPassword = req.body.password
  } catch (err) {
    servLog.info({
      email: req.body.email },
      'Handling the error that occurred whilst performing the password check')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  // Create a json web token from the user object.
  try {
    const token = await req.app.get('libTokens').createToken(user)
    servLog.info({
      email: req.body.email,
      token: token },
      'Successfully created token for user')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    req.app.get('libCookies').setCookie(res, token)
    res.status(200)

    // @todo HERE redirect to appropriate dashboard
    res.json({ loc: '/dashboard/charity' })
  } catch (err) {
    servLog.info({
      email: req.body.email },
      'Handling the error that occurred whilst creating a user token')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
  }
})

module.exports = router
