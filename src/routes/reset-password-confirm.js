'use strict'

const express = require('express')
const libSeo = require('../lib/seo')
const servLog = require('../services/log')
const UserFactory = require('../factories/user-factory')
const UserStates = require('../data/user-states')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const servDb = req.app.get('servDb')
  const tokenId = req.query.token
  let message = null
  let redirect = false

  try {
    const token = await req.app.get('servDb').getTokenActions().findToken(tokenId)
    if (token) {
      // Update user to indicate the password has been reset.
      const user = await req.app.get('servDb').getUserActions().findUser(UserFactory.createUserById(token.userId))
      user.password.isReset = true
      await req.app.get('servDb').getUserActions().upsertUser(user)

      // @todo HERE
      // Log user in and redirect (via client javascript) to password update page
      // Note that in login-auth we will need to set user.password.isReset=false every time
      // a user logs in with the correct password and the value is of user.password.isReset=true
      // Also note we need to update the database to accommodate the isReset flag.
      // Also note that when performing a password update (not yet built), if the isReset=true
      // then do not require the user to enter their current password
      const token = await libJWTokens.createJWToken(user)
      servLog.info({ user: user.toJSONWithoutPassword() }, 'Logged user in via password reset')
      libCookies.setCookie(res, token)
      message = 'Reset password request validated'
      redirect = true
    } else {
      message = 'Reset password link is invalid. Redirecting... If redirect does not occur, click here'
      servLog.info({ token: token }, message)
    }
  } catch (err) {
    message = 'An error occurred. Make sure you copied and pasted the password reset link correctly!'
    servLog.info({ err: err, token: token }, 'Error during password reset')
  }

  res.render('reset-password-confirm', {
    seo: libSeo('/reset-password-confirm'),
    route: '/reset-password-confirm',
    user: res.locals.user,
    message: message,
    redirect: redirect
  })
})

module.exports = router
