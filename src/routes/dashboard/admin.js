'use strict'

const express = require('express')

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.render('dashboard/admin', {
    seo: req.app.get('libSeo')('/dashboard/admin'),
    route: '/dashboard/admin',
    user: res.locals.user
  })
})

module.exports = router
