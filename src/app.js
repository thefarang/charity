'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const log = require('./services/log')
const helpers = require('./lib/helpers')
const index = require('./routes/index')
const login = require('./routes/login')
// const loginAuth = require('./routes/login-auth')
const dashboard = require('./routes/dashboard')
// const register = require('./routes/register')
// const registerSubmit = require('./routes/register-submit');

module.exports = (dbFacade) => {
  const appInstance = express()
  appInstance.set('dbFacade', dbFacade)

  // View engine setup and middleware
  appInstance.set('views', path.join(__dirname, 'views'))
  appInstance.set('view engine', 'ejs')
  appInstance.use(express.static(path.join(__dirname, 'public')))

  // Incoming data parsing middleware
  appInstance.use(bodyParser.json())
  appInstance.use(bodyParser.urlencoded({ extended: false }))

  // Json webtoken parsing middleware
  /*
  appInstance.use(async (req, res, next) => {
    try {
      const token = await helpers.getToken(req)
      if (token) {
        req.user = await helpers.getUserByToken(token)
      } else {
        req.user = await helpers.getGuestUser()
        req.user.acl = await helpers.getUserACLByRole(req.user.role)
      }
  
      if (!helpers.isUserAuthorised(req.path, req.method.toLowerCase(), req.user.acl)) {
        const err = new Error(null)
        err.status = 401
        throw err
      }
      return next()
    } catch (err) {
      // @todo logging
      return next(err)
    }
  })
  */

  // Route middlewares
  appInstance.use('/', index)
  appInstance.use('/login', login)
  // appInstance.use('/login-auth', loginAuth)
  appInstance.use('/dashboard', dashboard)
  // appInstance.use('/logout', logout); // @reminder - this is not needed with tokens, the client can simply delete the token

  // 404 middleware, called when no routes match the requested route.
  appInstance.use((req, res, next) => {
    const err = new Error('An unknown route has been requested')
    err.status = 404
    log.info({}, err.message)
    next(err)
  })

  // Error display middleware.
  appInstance.use((err, req, res, next) => {
    log.info({ err: err }, 'Error handled finally by the error display middleware')
    res.status(err.status || 500)
    res.render('error')
  })

  return appInstance
}
