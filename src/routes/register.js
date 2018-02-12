'use strict'

const express = require('express')
const UserRoles = require('../data/user-roles')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('register', {
    seo: req.app.get('libSeo')('/register'),
    route: '/register',
    user: res.locals.user,
    roles: [ UserRoles.CAUSE, UserRoles.DONATOR ]
  })
})

module.exports = router
