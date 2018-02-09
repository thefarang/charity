'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('register', {
    title: req.seo.getTitle('/register'),
    route: '/register',
    user: req.user
  })
})

module.exports = router
