'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('terms', { 
    title: req.seo.getTitle('/terms'),
    route: '/terms',
    user: req.user
  })
})

module.exports = router
