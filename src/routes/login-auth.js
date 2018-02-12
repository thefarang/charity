'use strict'

const express = require('express')
const validate = require('validate.js')
const servLog = require('../services/log')
const LoginAuthConstraints = require('../validate/constraints/login-auth')
const UserFromLoginAuthMapping = require('../validate/mappings/user-from-login-auth')
const UserFactory = require('../models/user-factory')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {

  const validationResult = validate(req.body, LoginAuthConstraints)
  if (validationResult) {
    servLog.info({ 
      schema: req.body,
      validationResult: validationResult },
      'Login details failed data validation')

    // @todo
    // Parse the validation result for a more helpful error message for the user
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json({ message: 'Login details failed data validation' })
    res.json()
    return
  }

  servLog.info({ schema: req.body }, 'Login details passed data validation')
  return next()
})

router.post('/', async (req, res, next) => {

  // Partially hydrate a user object from the schema
  let user = UserFactory.createUser(req.body, UserFromLoginAuthMapping)

  try {
    // Attempt to find the same user in the dbase
    user = await req.app.get('servDb').getUserActions().find(user)
    if (!user) {
      servLog.info({ user_email: req.body.user_email },'User not found in login')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(404)
      res.json()
      return
    }
    servLog.info({ user: user.toJSONWithoutPassword() }, 'User found in login')
  } catch (err) {
    servLog.info({ user_email: req.body.user_email }, 'Handling error locating the user')
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
      servLog.info({ user: user.toJSONWithoutPassword() }, 'User password is incorrect')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(401)
      res.json()
      return
    }
  } catch (err) {
    servLog.info({ user: user.toJSONWithoutPassword() }, 'Handling error from the password check')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  try {
    // Create a json web token from the user object.
    const token = await req.app.get('libTokens').createToken(user)
    servLog.info({ user: user.toJSONWithoutPassword(), token: token }, 'Successfully created token')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    req.app.get('libCookies').setCookie(res, token)
    res.status(200)

    // @todo HERE redirect to appropriate dashboard. Use the acl.isUserAuthorised to determine.
    res.json({ loc: '/dashboard/cause' })
  } catch (err) {
    servLog.info({ user: user.toJSONWithoutPassword() }, 'Handling error creating a user token')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
  }
})

module.exports = router
