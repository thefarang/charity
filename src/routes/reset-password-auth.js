'use strict'

const express = require('express')
const validate = require('validate.js')
const libJWTokens = require('../lib/jwt')
const libCookies = require('../lib/cookies')
const servLog = require('../services/log')
const TokenFactory = require('../factories/token-factory')
const UserFactory = require('../factories/user-factory')
const UserStates = require('../data/user-states')
const ResetPasswordAuthConstraints = require('../validate/constraints/reset-password-auth')
const UserFromResetPasswordAuthMapping = require('../validate/mappings/user-from-reset-password-auth')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {
  const validationResult = validate(req.body, ResetPasswordAuthConstraints)
  if (validationResult) {
    servLog.info({ 
      schema: req.body,
      validationResult: validationResult },
      'Reset password details failed data validation')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json(validationResult)
    res.json()
    return
  }
  servLog.info({ schema: req.body }, 'Reset password details passed data validation')
  return next()
})

router.post('/', async (req, res, next) => {
  const servDb = req.app.get('servDb')
  res.locals.user = UserFactory.createUser(req.body, UserFromResetPasswordAuthMapping)
  try {
    // Attempt to find the user in the dbase
    res.locals.user = await servDb.getUserActions().findUser(res.locals.user)
    if (!res.locals.user) {
      servLog.info({ user_email: req.body.user_email }, 'Email address not found.')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(404)
      res.send()
      return
    }
    servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'User found in reset password process')
  } catch (err) {
    servLog.info({ user_email: req.body.user_email }, 'Handling error locating the user for password reset')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.send()
    return
  }

  // Ensure the user has a UserStates.CONFIRMED status
  if (res.locals.user.state !== UserStates.CONFIRMED) {
    servLog.info({ 
      user: res.locals.user.toJSONWithoutPassword() }, 
      'User has not yet confirmed their account')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(401)
    res.json({ message: 'You need to first confirm your account using the link sent at registration' })
    return
  }
  servLog.info({ user: res.locals.user.toJSONWithoutPassword() }, 'User has correct status')
  return next()
})

router.use(async (req, res, next) => {
  try {
    // Send a password reset email. First build a token which will be
    // appended to the reset link.
    const passworddResetAuthToken = TokenFactory.createTokenFromUserId(res.locals.user.id)
    servLog.info({ passworddResetAuthToken: passworddResetAuthToken }, 'Password reset email token created')
    
    // Next save the token in the database and then send the email.
    await req.app.get('servDb').getTokenActions().saveToken(passworddResetAuthToken)
    req.app.get('servEmail').sendResetPassword(passworddResetAuthToken.token)
    servLog.info({ passworddResetAuthToken: passworddResetAuthToken }, 'Saved password reset token and sent email')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(200)
    res.json({ message: 'A password reset email has been sent' })
    return
  } catch (err) {
    servLog.info({ err: err, passworddResetAuthToken: passworddResetAuthToken }, 'Error sending password reset email')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'Failed to send password reset email.' })
  }
})

module.exports = router
