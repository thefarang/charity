'use strict'

const express = require('express')
const libSeo = require('../lib/seo')
const servLog = require('../services/log')

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const keywordSuggestions = await req.app.get('servSearch').searchKeywords(req.body.keyword)
    res.set('Cache-Control', 'private, max-age=0, no-cache')
    res.status(200)
    res.json(keywordSuggestions)
  } catch (err) {
    servLog.info({ keyword: req.body.keyword }, 'Handling error finding keyword suggestion list')
    return next(err)
  }
})

module.exports = router
