'use strict'

const express = require('express')

const log = require('../services/log')
const helpers = require('../lib/helpers')
const User = require('../models/user')
const Password = require('../models/password')
const roles = require('../data/roles')

const router = express.Router()

// @todo
// Capture all incoming data
router.post('/', async (req, res, next) => {
  // Sanitize the incoming data
  const sEmail = req.sanitize(req.body.email)
  const sClrPassword = req.sanitize(req.body.password)
  log.info({ 
    email: req.body.email, 
    sanitized_email: sEmail,
    clear_password: req.body.password,
    sanitized_clear_password: sClrPassword }, 
    'User registration attempt')
  
  // @todo
  // validate the data to ensure:
  // email format correct, passwords match, email does not exist already in the system
  // Validate emails using this: https://www.npmjs.com/package/email-validator

  // Attempt to find the user in the dbase
  const dbFacade = req.app.get('dbFacade')
  let user = null
  try {
    user = await dbFacade.getUserActions().findUserByEmail(sEmail)
  } catch (err) {
    log.info({ 
      email: req.body.email }, 
      'Handling the error that occurred whilst searching for a matching user')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  if (user !== null) {
    log.info({ 
      email: req.body.email }, 
      'User already exists in the dbase. Registration denied.')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(404)
    res.json()
    return
  }

console.log('USER NOT FOUND')

  // Store user in the database
  try {
    const password = new Password()
    password.clrPassword = sClrPassword
    password.encPassword = await password.getEncPasswordFromClearPassword(sClrPassword)

    user = new User()
    user.email = sEmail
    user.password = password
    user.role = roles.getCauseRole()

    user = await dbFacade.getUserActions().saveUser(user)
    log.info({ user: user.toJSON() }, 'New user registered')
  } catch (err) {
    log.info({ 
      email: req.body.email }, 
      'Handling the error that occurred whilst creating a new User')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

console.log('USER STORED IN DATABASE')
return

  // @todo
  // Create json web token from the user object and return
  try {
    const token = await helpers.createToken(user)
    log.info({ 
      email: req.body.email,
      token: token },
      'Successfully created token for user')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(200)
    res.json({ token: token })
  } catch (err) {
    log.info({ 
      email: req.body.email }, 
      'Handling the error that occurred whilst creating a user token')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
  }
})

module.exports = router
