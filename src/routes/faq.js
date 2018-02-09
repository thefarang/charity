'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('faq', { 
    seo: req.seo('/faq'),
    route: '/faq',
    user: req.user
  })
})

module.exports = router
