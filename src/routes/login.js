'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('login', {
    seo: req.seo('/login'),
    route: '/login',
    user: req.user
  })
})

module.exports = router
