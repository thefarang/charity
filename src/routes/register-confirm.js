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

  try {
    const token = await req.app.get('servDb').getTokenActions().findToken(tokenId)
    if (token) {
      const user = await req.app.get('servDb').getUserActions().findUser(UserFactory.createUserById(token.userId))
      user.state = UserStates.CONFIRMED
      await req.app.get('servDb').getUserActions().upsertUser(user)
      await req.app.get('servDb').getTokenActions().removeToken(token)
      message = 'User successfully registered. You can now log in.'
    } else {
      message = 'Registration link is invalid.'
      servLog.info({ token: token }, message)
    }
  } catch (err) {
    message = 'An error occurred. Make sure you copied and pasted the link correctly!'
    servLog.info({ err: err, token: token }, 'Error during registration confirmation')
  }

  res.render('register-confirm', {
    seo: libSeo('/register-confirm'),
    route: '/register-confirm',
    user: res.locals.user,
    message: message
  })
})

module.exports = router
