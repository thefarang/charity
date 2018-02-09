'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('login', {
    title: req.seo.getTitle('login'),
    user: req.user
  })
})

module.exports = router
