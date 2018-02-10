'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('reset-password', { 
    seo: req.app.get('libSeo')('/reset-password'),
    route: '/reset-password',
    user: res.locals.user
  })
})

module.exports = router
