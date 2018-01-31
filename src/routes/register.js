'use strict'

const express = require('express')

const router = express.Router()

// GET register page
router.get('/', (req, res, next) => {
  res.render('register', { title: 'Register page' })
})

/*
router.post('/', (req, res, next) => {
  // @todo
  // Validate emails using this package:
  // https://www.npmjs.com/package/email-validator
});
*/

module.exports = router
