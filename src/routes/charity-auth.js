'use strict'

const express = require('express')
// const { check, validationResult } = require('express-validator/check')

const servLog = require('../services/log')
const Charity = require('../models/charity')

const router = express.Router()

router.post('/', async (req, res, next) => {
  // @todo implement sanitisation
  /*
  // Sanitize against XSS
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
  servLog.info({}, 'Charity details update form validation')
  */

  // Attempt to find the charity in the search engine
  const servSearch = req.app.get('servSearch')
  let charity = null
  try {
    charity = await servSearch.findCharityById(req.body.charity_id)
  } catch (err) {
    servLog.info({
      charityId: req.body.charity_id },
      'Handling error searching for a matching Charity')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred. Please try again.' })
    return
  }

  // @todo
  // /login-auth and /register-auth should create Charity object Implement saga pattern there.
  // http://microservices.io/patterns/data/saga.html
  if (charity === null) {
    servLog.info({
      charityId: req.body.charity_id },
      'Charity does not exist in the search engine.')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'Charity does not exist in the search engine.' })
    return
  }

  // Store the updated charity in search.
  try {
    // charity.id remains unchanged
    // charity.userId remains unchanged
    charity.setIsVisible(req.body.is_visible)
    charity.name = req.body.name
    charity.country = req.body.country
    // @todo
    // Confirm if charity is registered using gov API
    charity.setIsRegistered(req.body.is_registered)
    charity.website = req.body.website
    charity.email = req.body.email
    charity.phone = req.body.phone
    charity.shortDesc = req.body.short_desc
    charity.longDesc = req.body.long_desc
    // @todo implement image upload and resizing (online service for rezing - see KeystoneJS)
    // charity.imageThumb = null
    // charity.imageFull = null
    charity.coinhiveKey = req.body.coinhive_key

    charity.keywords = []
    charity.keywords.push
    if (req.body.keyword_1) {
      charity.keywords.push(req.body.keyword_1)
    }
    if (req.body.keyword_2) {
      charity.keywords.push(req.body.keyword_2)
    }

    charity = await servSearch.updateCharity(charity)
    servLog.info({ charity: charity.toJSON() }, 'Charity details updated')
  } catch (err) {
    servLog.info({
      err: err,
      charity: charity.toJSON() },
      'Handling error updating a Charity')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(500)
    res.json({ message: 'An error occurred whilst updating the Charity. Please try again.' })
    return
  }

  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json()
})

module.exports = router
