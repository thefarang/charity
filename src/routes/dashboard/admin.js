'use strict'

const express = require('express')

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.render('dashboard/admin', {
    title: 'Admin Dashboard page'
  })
})

module.exports = router
