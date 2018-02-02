'use strict'

const express = require('express')

const router = express.Router()

// GET login page
router.get('/', (req, res, next) => {
  // @todo
  // Is error message needd here? Yes, for when auto-redirects occur
  let errorMessage = null
  res.render('login', {
    title: 'Login',
    error_message: errorMessage
  })
})

module.exports = router
