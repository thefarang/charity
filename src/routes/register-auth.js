'use strict'

const express = require('express')
const { check, validationResult } = require('express-validator/check')

const servLog = require('../services/log')
const dataRoles = require('../data/roles')

const User = require('../models/user')
const Password = require('../models/password')
const Charity = require('../models/charity')

const router = express.Router()

router.post('/', async (req, res, next) => {
  // @todo critical - saga pattern for User -> Charity creation
  // @todo critical - get this lot working
  // Sanitize against XSS
  /*
  req.body.first_name = req.sanitize(req.body.first_name)
  req.body.last_name = req.sanitize(req.body.last_name)
  req.body.email = req.sanitize(req.body.email)
  req.body.confirm_email = req.sanitize(req.body.confirm_email)
  req.body.password = req.sanitize(req.body.password)
  req.body.confirm_password = req.sanitize(req.body.confirm_password)
  servLog.info({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    clear_password: req.body.password },
    'Sanitized XSS pre-registration')

  // Validate and clean form
  check('first_name')
    .exists().withMessage('First name is required')
    .isAlpha().withMessage('First name should contain only characters a-zA-Z')
    .isLength({ max: 20 }).withMessage('First name should be a maximum of 20 characters')
    .trim()

  check('last_name')
    .exists().withMessage('Last name is required')
    .isAlpha().withMessage('Last name should contain only characters a-zA-Z')
    .isLength({ max: 25 }).withMessage('Last name should be a maximum of 25 characters')
    .trim()

  check('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email address is not valid')
    .matches(req.body.confirm_email).withMessage('Email addresses do not match')
    .trim()
    .normalizeEmail()

  // @todo
  // Add additional checks for inclusion of numbers etc
  check('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be minimum 6 characters long')
    .matches(req.body.confirm_password).withMessage('Passwords do not match')

  // @todo critical
  // check().trim() is not working
  servLog.info({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    clear_password: req.body.password },
    'Validated and cleaned form data pre-registration')

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    servLog.info({ errors: errors.mapped() }, 'Registration attempt failed form validation')
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(422)
    res.json({ errors: errors.mapped() })
    return
  }
  servLog.info({}, 'Registration attempt passed form validation')
  */

  // Attempt to find the user in the dbase
  const servDb = req.app.get('servDb')
  let user = null
  try {
    user = await servDb.getUserActions().findUserByEmail(req.body.email)
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
      'User already exists in the dbase. Registration attempt denied.')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(404)
    res.json({ message: 'Email already exists in the system' })
    return
  }

  // Store the new user in the database.
  try {
    user = new User()
    user.email = req.body.email

    const password = new Password()
    password.clrPassword = req.body.password
    password.encPassword = await password.getEncPasswordFromClearPassword(req.body.password)
    user.password = password
    user.role = dataRoles.getCauseRole()

    user = await servDb.getUserActions().saveNewUser(user)
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

  // Create a Charity object for the user and store in the search engine
  const servSearch = req.app.get('servSearch')
  let charity = new Charity()
  charity.userId = user.id
  try {
    charity = await servSearch.saveNewCharity(charity)
    servLog.info({ userId: charity.userId, charityId: charity.id }, 'New charity added')
  } catch (err) {
    // @todo critical
    // If this fails, the user will not have a charity. What happens?
    servLog.info({
      user: user.toJSON() },
      'Handling the error that occurred whilst creating a new Charity')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst adding the new charity.' })
    return
  }

  // Create json web token from the user object and return
  try {
    const token = await req.app.get('libTokens').createToken(user)
    servLog.info({
      user: user.toJSON(),
      token: token },
      'Successfully created token for newly registered user')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    req.app.get('libCookies').setCookie(res, token)
    res.status(200)

    // @todo HERE redirect to appropriate dashboard
    res.json({ loc: '/dashboard/charity' })
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
