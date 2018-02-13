'use strict'

const express = require('express')
const LoginAuthSchema = require('../validate/schema/login-auth')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('login', {
    seo: req.app.get('libSeo')('/login'),
    route: '/login',
    user: res.locals.user,
    LoginAuthSchema: LoginAuthSchema
  })
})

module.exports = router
