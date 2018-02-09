'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('faq', { 
    title: req.seo.getTitle('faq'),
    user: req.user
  })
})

module.exports = router
