'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('faq', { 
    seo: req.app.get('libSeo')('/faq'),
    route: '/faq',
    user: res.locals.user
  })
})

module.exports = router
