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
const libSeo = require('./lib/seo')
const dataUsers = require('./data/users')

const index = require('./routes/index')
const explore = require('./routes/explore')
const faq = require('./routes/faq')
const terms = require('./routes/terms')
const resetPassword = require('./routes/reset-password')
const register = require('./routes/register')
const registerAuth = require('./routes/register-auth')
const login = require('./routes/login')
const loginAuth = require('./routes/login-auth')

const charity = require('./routes/dashboard/charity')
const charityAuth = require('./routes/dashboard/charity-auth')
const admin = require('./routes/dashboard/admin')

module.exports = (servDb, servSearch) => {
  const appInstance = express()
  appInstance.set('servDb', servDb)
  appInstance.set('servSearch', servSearch)

  // View engine setup and middleware
  appInstance.set('views', path.join(__dirname, 'views'))
  appInstance.set('view engine', 'ejs')
  appInstance.use(express.static(path.join(__dirname, 'public')))

  // Incoming data parsing, sanitizing and validation middleware
  appInstance.use(bodyParser.json())
  appInstance.use(bodyParser.urlencoded({ extended: false }))
  appInstance.use(expressSanitizer())

  // @todo - add libTokens, libCookies and libACL here too
  // Middleware to assign helpers to the request object
  appInstance.use((req, res, next) => {
    req.libAcl = libAcl
    req.libSeo = libSeo
    req.libTokens = libTokens
    req.libCookies = libCookies
    return next()
  })

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
          // Route to the correct dashboard
          const route = req.user.role.name === 'admin' ? 'admin' : 'charity'
          res.redirect(302, `/dashboard/${route}`)
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
  appInstance.use('/explore', explore)
  appInstance.use('/faq', faq)
  appInstance.use('/terms', terms)
  appInstance.use('/reset-password', resetPassword)
  appInstance.use('/register', register)
  appInstance.use('/register-auth', registerAuth)
  appInstance.use('/login', login)
  appInstance.use('/login-auth', loginAuth)
  appInstance.use('/dashboard/charity', charity)
  appInstance.use('/dashboard/charity-auth', charityAuth)
  appInstance.use('/dashboard/admin', admin)

  // 404 middleware, called when no routes match the requested route.
  appInstance.use((req, res, next) => {
    servLog.info({ path: req.path }, 'An unknown route has been requested')
    res.render('404', {
      seo: req.libSeo('/404'),
      route: '/404',
      user: req.user
    })
  })

  // @todo here - organise the display. Possibly created dedicated 404 page.
  // Error display middleware.
  appInstance.use((err, req, res, next) => {
    servLog.info({ err: err }, 'Error handled finally by the error display middleware')
    res.status(err.status || 500)
    res.render('error', {
      seo: req.libSeo('/error'),
      route: '/error',
      user: req.user || null,
      error: err
    })
  })

  return appInstance
}
