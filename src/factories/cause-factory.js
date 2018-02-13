'use strict'

const config = require('config')
const _ = require('lodash')
const Cause = require('../models/cause')

const createCauseByUserId = (userId) => {
  const cause = new Cause()
  cause.userId = userId
  return cause
}

const createEmptyCause = () => {
  return new Cause()
}

const createCause = (schema, schemaToCauseMapping) => {
  const cause = new Cause()
  if (schemaToCauseMapping['id']) {
    cause.id = _.get(schema, schemaToCauseMapping.id)
  }
  if (schemaToCauseMapping['userId']) {
    cause.userId = _.get(schema, schemaToCauseMapping.userId)
  }
  if (schemaToCauseMapping['name']) {
    cause.name = _.get(schema, schemaToCauseMapping.name)
  }
  if (schemaToCauseMapping['country']) {
    cause.country = _.get(schema, schemaToCauseMapping.country)
  }
  return cause
}

module.exports = {
  createCauseByUserId,
  createCause,
  createEmptyCause
}
