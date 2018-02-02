'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSanitizer = require('express-sanitizer')

const servLog = require('./services/log')
const libAcl = require('./lib/acl')
const libCookies = require('./lib/cookies')
const libTokens = require('./lib/tokens')
const dataUsers = require('./data/users')

const index = require('./routes/index')
const register = require('./routes/register')
const registerAuth = require('./routes/register-auth')
const login = require('./routes/login')
const loginAuth = require('./routes/login-auth')
const dashboard = require('./routes/dashboard')

module.exports = (dbFacade) => {
  const appInstance = express()
  appInstance.set('dbFacade', dbFacade)

  // View engine setup and middleware
  appInstance.set('views', path.join(__dirname, 'views'))
  appInstance.set('view engine', 'ejs')
  appInstance.use(express.static(path.join(__dirname, 'public')))

  // Incoming data parsing and sanitizing middleware
  appInstance.use(bodyParser.json())
  appInstance.use(bodyParser.urlencoded({ extended: false }))
  appInstance.use(expressSanitizer())

  // Json webtoken parsing middleware. The jwt, if it exists, will
  // be stored in the cookie.
  appInstance.use(cookieParser())
  let token = null
  appInstance.use(async (req, res, next) => {
    try {
      token = libTokens.getToken(req)
      if (token) {
        servLog.info({ token: token }, 'Token found')
        req.user = await libTokens.getUserByToken(token)
        if (!req.user) {
          servLog.info({ token: token }, 'Token has expired.')
          libCookies.unsetCookie(res)
          res.redirect(302, '/login')
          return
        }
      } else {
        req.user = dataUsers.getGuestUser()
      }

      if (!libAcl.isUserAuthorised(req.path, req.method.toLowerCase(), req.user.role)) {
        // @todo
        // If guest, then redirect to /login
        // If user, then redirect to /dashboard
        const err = new Error()
        err.status = 401
        throw err
      }
      return next()
    } catch (err) {
      servLog.info({ err: err, token: token }, 'An error ocurred whilst parsing json webtoken')
      return next(err)
    }

  })

  // Route middlewares
  appInstance.use('/', index)
  appInstance.use('/register', register)
  appInstance.use('/register-auth', registerAuth)
  appInstance.use('/login', login)
  appInstance.use('/login-auth', loginAuth)
  appInstance.use('/dashboard', dashboard)
  // appInstance.use('/logout', logout); // @reminder - this is not needed with tokens, the client can simply delete the token

  // 404 middleware, called when no routes match the requested route.
  appInstance.use((req, res, next) => {
    const err = new Error('An unknown route has been requested')
    err.status = 404
    servLog.info({}, err.message)
    next(err)
  })

  // Error display middleware.
  appInstance.use((err, req, res, next) => {
    servLog.info({ err: err }, 'Error handled finally by the error display middleware')
    res.status(err.status || 500)
    // if err.status === 401 then include in res.set() WWW-Authenticate: Bearer realm="example"
    res.render('error', { error: err })
  })

  return appInstance
}
