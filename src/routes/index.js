'use strict'

const express = require('express')
const libSeo = require('../lib/seo')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', {
    seo: libSeo('/'),
    route: '/',
    user: res.locals.user
  })
})

module.exports = router
