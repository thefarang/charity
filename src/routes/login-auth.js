'use strict'

const express = require('express')
const validate = require('validate.js')

const servLog = require('../services/log')
const loginAuthSchema = require('../validate/schema/login-auth')
const loginAuthConstraints = require('../validate/constraints/login-auth')
const UserFactory = require('../models/user-factory')

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

  // Partially hydrate a user object from the schema
  const userSchema = res.locals.schema
  let user = UserFactory.createFromSchema(userSchema)

  try {
    // Attempt to find the same user in the dbase
    user = await req.app.get('servDb').getUserActions().find(user)
    if (!user) {
      servLog.info({ user: user.toSecureSchema() },'User not found in login')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(404)
      res.json()
      return
    }
    servLog.info({ user: user.toSecureSchema() }, 'User found in login')
  } catch (err) {
    servLog.info({ user: user.toSecureSchema() }, 'Handling error locating the user')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  try {
    // @todo - can we move this to the database code?
    // Test the password is correct
    const isPasswordCorrect =
      await user.password.isClearPasswordCorrect(
        user.password.clearPassword, user.password.encryptedPassword)

    if (!isPasswordCorrect) {
      servLog.info({ user: user.toSecureSchema() }, 'User password is incorrect')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(401)
      res.json()
      return
    }
  } catch (err) {
    servLog.info({ user: user.toSecureSchema() }, 'Handling error from the password check')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  try {
    // Create a json web token from the user object.
    const token = await req.app.get('libTokens').createToken(user)
    servLog.info({ user: user.toSecureSchema(), token: token }, 'Successfully created token')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    req.app.get('libCookies').setCookie(res, token)
    res.status(200)

    // @todo HERE redirect to appropriate dashboard. Use the acl.isUserAuthorised to determine.
    res.json({ loc: '/dashboard/charity' })
  } catch (err) {
    servLog.info({ user: user.toSecureSchema() }, 'Handling error creating a user token')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
  }
})

module.exports = router
