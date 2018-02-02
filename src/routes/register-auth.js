'use strict'

const express = require('express')

const servLog = require('../services/log')
const libTokens = require('../lib/tokens')
const libCookies = require('../lib/cookies')
const dataRoles = require('../data/roles')

const User = require('../models/user')
const Password = require('../models/password')

const router = express.Router()

// @todo
// Capture all incoming data
router.post('/', async (req, res, next) => {
  // Sanitize the incoming data
  const sFirstName = req.sanitize(req.body.first_name)
  const sLastName = req.sanitize(req.body.last_name)
  const sEmail = req.sanitize(req.body.email)
  const sConfirmedEmail = req.sanitize(req.body.confirm_email)
  const sClrPassword = req.sanitize(req.body.password)
  const sClrConfirmedPassword = req.sanitize(req.body.confirm_password)

  servLog.info({
    first_name: req.body.first_name,
    sanitized_first_name: sFirstName,
    last_name: req.body.last_name,
    sanitized_last_name: sLastName,
    email: req.body.email,
    sanitized_email: sEmail,
    clear_password: req.body.password,
    sanitized_clear_password: sClrPassword }, 
    'User registration attempt')
  
  // @todo
  // validate the data to ensure:
  // email format correct, passwords match, email does not exist already in the system
  // Validate emails using this: https://www.npmjs.com/package/email-validator

  // Check that values exist for each field.
  // Check that lengths are not exceeded
  // Check that emails correctly match
  // Check that emails are correctly formatted
  // Check that passwords correctly match

  // Attempt to find the user in the dbase
  const dbFacade = req.app.get('dbFacade')
  let user = null
  try {
    user = await dbFacade.getUserActions().findUserByEmail(sEmail)
  } catch (err) {
    servLog.info({ 
      email: req.body.email }, 
      'Handling the error that occurred whilst searching for a matching user')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred. Please try again.' })
    return
  }

  if (user !== null) {
    servLog.info({ 
      email: req.body.email }, 
      'User already exists in the dbase. Registration denied.')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(404)
    res.json({ message: 'Email already exists in the system' })
    return
  }

  // Store the new user in the database.
  try {
    user = new User()
    user.email = sEmail
    
    const password = new Password()
    password.clrPassword = sClrPassword
    password.encPassword = await password.getEncPasswordFromClearPassword(sClrPassword)
    user.password = password
    user.role = dataRoles.getCauseRole()

    user = await dbFacade.getUserActions().saveUser(user)
    servLog.info({ user: user.toJSON() }, 'New user registered')
  } catch (err) {
    servLog.info({
      err: err,
      email: req.body.email },
      'Handling the error that occurred whilst creating a new User')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst adding the new user. Please try again.' })
    return
  }

  // Create json web token from the user object and return
  try {
    const token = await libTokens.createToken(user)
    servLog.info({ 
      user: user.toJSON(),
      token: token },
      'Successfully created token for newly registered user')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    libCookies.setCookie(res, token)
    res.status(200)
    res.json({ token: token })
  } catch (err) {
    servLog.info({ 
      user: user.toJSON() },
      'Handling the error that occurred whilst creating a newly registered user token')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'Failed to authorise user. Please attempt to login.' })
  }
})

module.exports = router
