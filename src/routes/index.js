'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', {
    seo: req.app.get('libSeo')('/'),
    route: '/',
    user: res.locals.user
  })
})

module.exports = router
