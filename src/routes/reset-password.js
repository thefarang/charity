'use strict'

const express = require('express')
const libSeo = require('../lib/seo')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('reset-password', { 
    seo: libSeo('/reset-password'),
    route: '/reset-password',
    user: res.locals.user
  })
})

module.exports = router
