'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('reset-password', { 
    seo: req.seo('/reset-password'),
    route: '/reset-password',
    user: req.user
  })
})

module.exports = router
