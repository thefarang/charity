'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('faq', { 
    seo: req.libSeo('/faq'),
    route: '/faq',
    user: req.user
  })
})

module.exports = router
