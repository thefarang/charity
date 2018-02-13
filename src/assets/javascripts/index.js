'use strict'

const $ = require('jquery')
const Popper = require('popper.js')
require('bootstrap')

const handlers = require('./handlers')
const login = require('./login')
const register = require('./register')
const cause = require('./cause')

$(() => {
  handlers.handleLogout()
  login.handleLogin()
  register.handleRegister()
  cause.handleCause()
})
