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

module.exports = (servDb) => {
  const appInstance = express()
  appInstance.set('servDb', servDb)

  // View engine setup and middleware
  appInstance.set('views', path.join(__dirname, 'views'))
  appInstance.set('view engine', 'ejs')
  appInstance.use(express.static(path.join(__dirname, 'public')))

  // Incoming data parsing, sanitizing and validation middleware
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

      // Handle 404s
      if (!libAcl.isResourceExistant(req.path)) {
        servLog.info({ route: req.path }, 'Unknown route requested. Sending to 404 handler')
        return next()
      }

      // Handle 401 Unauthorized through 302 Redirect. Not semantically correct but supports the
      // end user well-enough and minimises work here.
      if (!libAcl.isUserAuthorised(req.path, req.method.toLowerCase(), req.user.role)) {
        servLog.info({
          user: req.user.toJSON(),
          resource: req.path
        }, 'User attempted to access unauthorised route. Redirecting.')

        if (req.user.role.name === 'guest') {
          res.redirect(302, '/login')
        } else {
          res.redirect(302, '/dashboard')
        }
        return
      }

      // Delegate to the route handlers below
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
    res.render('error', { error: err })
  })

  return appInstance
}
