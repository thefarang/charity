'use strict'

const express = require('express')
const libSeo = require('../lib/seo')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('terms', { 
    seo: libSeo('/terms'),
    route: '/terms',
    user: res.locals.user
  })
})

module.exports = router
