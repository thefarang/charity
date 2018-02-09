'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index', {
    title: req.seo.getTitle('index'),
    user: req.user
  })
})

module.exports = router
