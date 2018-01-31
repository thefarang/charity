'use strict'

const config = require('config')
const express = require('express')

const log = require('../services/log')
const helpers = require('../lib/helpers')

const router = express.Router()

router.post('/', async (req, res, next) => {
  // Sanitize the incoming data
  const sEmail = req.sanitize(req.body.email)
  const sClrPassword = req.sanitize(req.body.password)
  log.info({ 
    email: req.body.email, 
    sanitized_email: sEmail,
    clear_password: req.body.password,
    sanitized_clear_password: sClrPassword }, 
    'User login attempt')

  // Attempt to find the user in the dbase
  const dbFacade = req.app.get('dbFacade')
  let user = null
  try {
    user = await dbFacade.getUserActions().findUserByEmail(sEmail)
  } catch (err) {
    log.info({ 
      email: req.body.email }, 
      'Handling the error that occurred whilst locating the user')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  if (user === null) {
    log.info({ 
      email: req.body.email }, 
      'User not found based on email and password search')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(404)
    res.json()
    return
  }

  console.log('USER FOUND')
  console.log(user)

  // Test the password is correct
  try {
    const isPasswordCorrect =
      await user.password.isClearPasswordCorrect(sClrPassword, user.password.encPassword)
    if (!isPasswordCorrect) {
      log.info({ email: req.body.email }, 'User password is incorrect')
      res.set('Cache-Control', 'private, max-age=0, no-cache')
      res.status(401)
      res.json()
      return
    }

    // Authentication successful. Update the User.Password object.
    user.password.clrPassword = sClrPassword
  } catch (err) {
    log.info({ 
      email: req.body.email }, 
      'Handling the error that occurred whilst performing the password check')
    
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json()
    return
  }

  // Create a json web token from the user object.
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
