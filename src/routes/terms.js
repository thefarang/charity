'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('terms', { 
    seo: req.app.get('libSeo')('/terms'),
    route: '/terms',
    user: res.locals.user
  })
})

module.exports = router
