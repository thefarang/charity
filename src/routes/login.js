'use strict'

const express = require('express')

const router = express.Router()

// GET login page
router.get('/', (req, res, next) => {
  // ok, what do we need to do here?
  // We need form elements on the page already
  res.render('login', { title: 'Login page' })
})

module.exports = router
