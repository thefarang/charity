'use strict'

const $ = require('jquery')
const Popper = require('popper.js')
require('bootstrap')

// @todo -import the bootstrap.min.css in the less file

const handlers = require('./handlers')
const login = require('./login')
const register = require('./register')
const charity = require('./charity')

$(() => {
  handlers.handleLogout()
  login.handleLogin()
  register.handleRegister()
  charity.handleCharity()
})
