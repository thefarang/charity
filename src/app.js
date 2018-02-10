'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const servLog = require('./services/log')
const libAcl = require('./lib/acl')
const libCookies = require('./lib/cookies')
const libTokens = require('./lib/tokens')
const libSeo = require('./lib/seo')
const dataUsers = require('./data/users')

const { 
  handleIdentifyUser,
  handleCheckRouteAuthorisation,
  handleResourceNotFound,
  handleApplicationError } = require('./middlewares/app')

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

  // Add services, library helpers and data helpers to the app, for later use elsewhere
  appInstance.set('servDb', servDb)
  appInstance.set('servSearch', servSearch)
  appInstance.set('servLog', servLog)
  appInstance.set('libAcl', libAcl)
  appInstance.set('libSeo',libSeo)
  appInstance.set('libTokens', libTokens)
  appInstance.set('libCookies', libCookies)
  appInstance.set('dataUsers', dataUsers)

  // View engine setup and middleware
  appInstance.set('views', path.join(__dirname, 'views'))
  appInstance.set('view engine', 'ejs')
  appInstance.use(express.static(path.join(__dirname, 'public')))

  // Incoming data parsing, sanitizing and validation middleware
  appInstance.use(bodyParser.json())
  appInstance.use(bodyParser.urlencoded({ extended: false }))

  // Json webtoken parsing middleware. The jwt, if it exists, will
  // be stored in the cookie.
  appInstance.use(cookieParser())

  // Business logic middlewares
  appInstance.use(handleIdentifyUser)
  appInstance.use(handleCheckRouteAuthorisation)
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
  appInstance.use(handleResourceNotFound)
  appInstance.use(handleApplicationError)
  return appInstance
}
