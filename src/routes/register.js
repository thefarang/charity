'use strict'

const express = require('express')
const roleDataHelper = require('../data/roles')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('register', {
    seo: req.app.get('libSeo')('/register'),
    route: '/register',
    user: res.locals.user,
    roles: roleDataHelper.getRegisterableRoleSchemas()
  })
})

module.exports = router
