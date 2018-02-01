'use strict'

const express = require('express')

const router = express.Router()

// GET login page
router.get('/', (req, res, next) => {
  // ok, what do we need to do here?
  // We need form elements on the page already
  let errorMessage = null
  res.render('login', {
    title: 'Login',
    error_message: errorMessage
  })
})

module.exports = router
