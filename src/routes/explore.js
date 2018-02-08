'use strict'

const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('explore', { title: 'Explore' })
})

module.exports = router
