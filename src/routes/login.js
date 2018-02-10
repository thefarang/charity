'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('login', {
    seo: req.app.get('libSeo')('/login'),
    route: '/login',
    user: res.locals.user
  })
})

module.exports = router
