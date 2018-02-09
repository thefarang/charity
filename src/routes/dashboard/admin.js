'use strict'

const express = require('express')

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.render('dashboard/admin', {
    title: req.seo.getTitle('dashboard/admin'),
    user: req.user
  })
})

module.exports = router
