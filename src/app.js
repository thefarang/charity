'use strict'

const express = require('express')
const compression = require('compression')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const { 
  handleIdentifyUser,
  handleCheckRouteAuthorisation,
  handleResourceNotFound,
  handleApplicationError } = require('./middlewares/app')

const search = require('./routes/search')
const index = require('./routes/index')
const explore = require('./routes/explore')
const terms = require('./routes/terms')
const resetPassword = require('./routes/reset-password')
const resetPasswordAuth = require('./routes/reset-password-auth')
const resetPasswordConfirm = require('./routes/reset-password-confirm')
const register = require('./routes/register')
const registerAuth = require('./routes/register-auth')
const registerConfirm = require('./routes/register-confirm')
const login = require('./routes/login')
const loginAuth = require('./routes/login-auth')
const charity = require('./routes/dashboard/cause')
const charityAuth = require('./routes/dashboard/cause-auth')
const admin = require('./routes/dashboard/admin')

module.exports = (dbService, searchService, emailService) => {
  const appInstance = express()
  appInstance.set('servDb', dbService)
  appInstance.set('servSearch', searchService)
  appInstance.set('servEmail', emailService)

  // View engine setup and middleware
  appInstance.set('views', path.join(__dirname, 'views'))
  appInstance.set('view engine', 'ejs')
  appInstance.use(compression())
  appInstance.use(express.static(path.join(__dirname, 'public')))

  // Incoming data parsing, sanitizing and validation middleware
  appInstance.use(bodyParser.json())
  appInstance.use(bodyParser.urlencoded({ extended: false }))

  // Json webtoken parsing middleware. The jwt, if it exists, will
  // be stored in the cookie.
  appInstance.use(cookieParser())

  // Search occurs without needing to identify the user and check
  // they are authorised to access the route. This speeds things up.
  appInstance.use('/search', search)

  // Business logic middlewares
  appInstance.use(handleIdentifyUser)
  appInstance.use(handleCheckRouteAuthorisation)

  appInstance.use('/', index)
  appInstance.use('/explore', explore)
  appInstance.use('/search', search)
  appInstance.use('/terms', terms)
  appInstance.use('/reset-password', resetPassword)
  appInstance.use('/reset-password-auth', resetPasswordAuth)
  appInstance.use('/reset-password-confirm', resetPasswordConfirm)
  appInstance.use('/register', register)
  appInstance.use('/register-auth', registerAuth)
  appInstance.use('/register-confirm', registerConfirm)
  appInstance.use('/login', login)
  appInstance.use('/login-auth', loginAuth)
  appInstance.use('/dashboard/cause', charity)
  appInstance.use('/dashboard/cause-auth', charityAuth)
  appInstance.use('/dashboard/admin', admin)
  appInstance.use(handleResourceNotFound)
  appInstance.use(handleApplicationError)
  return appInstance
}
