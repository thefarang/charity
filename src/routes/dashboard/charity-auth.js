'use strict'

const express = require('express')
const validate = require('validate.js')

const servLog = require('../../services/log')
const charityAuthSchema = require('../../validate/schema/charity-auth')
const charityAuthConstraints = require('../../validate/constraints/charity-auth')

const Charity = require('../../models/charity')

const router = express.Router()

// This middleware is executed for every request to the router.
router.use((req, res, next) => {

  const schema = charityAuthSchema.buildSchema(req.body)
  const validationResult = validate(schema, charityAuthConstraints)

  if (validationResult) {
    servLog.info({ 
      schema: schema,
      validationResult: validationResult },
      'Charity details failed data validation')

    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(400)
    res.json()
    return
  }

  servLog.info({ schema: schema }, 'Charity details passed data validation')
  res.locals.schema = schema
  return next()
})

router.post('/', async (req, res, next) => {

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
