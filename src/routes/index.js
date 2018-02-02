'use strict'

const express = require('express')

const router = express.Router()

// GET home page
router.get('/', (req, res, next) => {

  // Lets see if the cookie is passed in...
  // @todo DELETE THIS
  /*
  console.log('HERE')
  console.log(req.cookies)
  res.cookie('name', 'value of cookie')
  */

  res.render('index', { title: 'Index page' })
})

module.exports = router
