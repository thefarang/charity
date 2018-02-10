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

  // Add services and library helpers to the app, for later use elsewhere
  appInstance.set('servDb', servDb)
  appInstance.set('servSearch', servSearch)
  appInstance.set('libAcl', libAcl)
  appInstance.set('libSeo',libSeo)
  appInstance.set('libTokens', libTokens)
  appInstance.set('libCookies', libCookies)

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

  // @todo
  // Extract this into it's own middleware file
  appInstance.use(async (req, res, next) => {
    let token = null
    try {
      token = libTokens.getToken(req)
      if (token) {
        servLog.info({ token: token }, 'Token found')
        res.locals.user = await libTokens.getUserByToken(token)
        if (!res.locals.user) {
          servLog.info({ token: token }, 'Token has expired.')
          libCookies.unsetCookie(res)
          res.redirect(302, '/login')
          return
        }
      } else {
        res.locals.user = dataUsers.getGuestUser()
      }

      // Handle 404s
      if (!libAcl.isResourceExistant(req.path)) {
        servLog.info({ route: req.path }, 'Unknown route requested. Sending to 404 handler')
        return next()
      }

      // Handle 401 Unauthorized through 302 Redirect. Not semantically correct but supports the
      // end user well-enough and minimises work here.
      if (!libAcl.isUserAuthorised(req.path, req.method.toLowerCase(), res.locals.user.role)) {
        servLog.info({
          user: res.locals.user.toJSON(),
          resource: req.path
        }, 'User attempted to access unauthorised route. Redirecting.')

        if (res.locals.user.role.name === 'guest') {
          res.redirect(302, '/login')
        } else {
          // Route to the correct dashboard
          const route = res.locals.user.role.name === 'admin' ? 'admin' : 'charity'
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

  // 404 middleware
  appInstance.use((req, res, next) => {
    servLog.info({ path: req.path }, 'An unknown route has been requested')
    res.render('404', {
      seo: libSeo('/404'),
      route: '/404',
      user: res.locals.user,
      message: `This page isn't available`
    })
  })

  // 500 middleware
  appInstance.use((err, req, res, next) => {
    servLog.info({ err: err }, 'Error handled finally by the error display middleware')
    res.status(500)
    res.render('500', {
      seo: libSeo('/error'),
      route: '/error',
      user: res.locals.user || null,
      message: `Something went wrong, sorry. Please wait a few moments then refresh this page`
    })
  })

  return appInstance
}
