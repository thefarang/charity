'use strict'

const express = require('express')
const validate = require('validate.js')
const libJWTokens = require('../lib/jwt')
const libCookies = require('../lib/cookies')
const servLog = require('../services/log')
const UserFactory = require('../factories/user-factory')
const UserStates = require('../data/user-states')
const LoginAuthConstraints = require('../validate/constraints/login-auth')
const UserFromLoginAuthMapping = require('../validate/mappings/user-from-login-auth')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {
  const validationResult = validate(req.body, LoginAuthConstraints)
  if (validationResult) {
    servLog.info({ 
      schema: req.body,
      validationResult: validationResult },
      'Login details failed data validation')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json(validationResult)
    res.json()
    return
  }
  servLog.info({ schema: req.body }, 'Login details passed data validation')
  return next()
})

router.post('/', async (req, res, next) => {
  const servDb = req.app.get('servDb')
  res.locals.user = UserFactory.createUser(req.body, UserFromLoginAuthMapping)
  try {
    // Attempt to find the same user in the dbase
    res.locals.user = await servDb.getUserActions().findUser(res.locals.user)
    if (!res.locals.user) {
      servLog.info({ user_email: req.body.user_email }, 'User not found in login')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(404)
      res.json()
      return
    }
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'User found in login')
  } catch (err) {
    servLog.info({ user_email: req.body.user_email }, 'Handling error locating the user')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  // Ensure the user has a UserStates.CONFIRMED status
  if (res.locals.user.state !== UserStates.CONFIRMED) {
    servLog.info({ 
      user: res.locals.user.toJSONWithoutPassword() }, 
      'User does not have a CONFIRMED status')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(401)
    res.json({ message: 'You need to confirm your email address' })
    return
  }
  servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'User has correct status')

  try {
    // Test the password is correct
    const isPasswordCorrect =
      await res.locals.user.password.isClearPasswordCorrect(
        res.locals.user.password.clearPassword, res.locals.user.password.encryptedPassword)

    if (!isPasswordCorrect) {
      servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'User password is incorrect')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(401)
      res.json({ message: 'User password incorrect' })
      return
    }
    return next()
  } catch (err) {
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'Handling error from the password check')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
  }
})

router.use(async (req, res, next) => {
  try {
    // Create a json web token from the user object.
    const token = await libJWTokens.createJWToken(res.locals.user)
    servLog.info({ user: res.locals.user.toJSONWithoutPassword(), token: token }, 'Successfully created token')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    libCookies.setCookie(res, token)
    res.status(200)
    res.json({ loc: '/dashboard/cause' })
  } catch (err) {
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'Handling error creating a user token')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
  }
})

module.exports = router
