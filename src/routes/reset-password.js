'use strict'

const express = require('express')
const libSeo = require('../lib/seo')
const ResetPasswordAuthSchema = require('../validate/schema/reset-password-auth')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('reset-password', { 
    seo: libSeo('/reset-password'),
    route: '/reset-password',
    user: res.locals.user,
    ResetPasswordAuthSchema: ResetPasswordAuthSchema
  })
})

module.exports = router
