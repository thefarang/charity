'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('reset-password', { 
    title: req.seo.getTitle('/reset-password'),
    route: '/reset-password',
    user: req.user
  })
})

module.exports = router
