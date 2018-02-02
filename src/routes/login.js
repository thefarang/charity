'use strict'

const express = require('express')

const router = express.Router()

// GET login page
router.get('/', (req, res, next) => {
  // @todo
  // Is error message needd here?
  let errorMessage = null
  res.render('login', {
    title: 'Login',
    error_message: errorMessage
  })
})

module.exports = router
