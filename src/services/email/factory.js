'use strict'

const aws = require('./aws/aws')
// const other = require('./other/other')

module.exports = (mailProvider) => {
  if (mailProvider === 'aws') {
    return aws()
  }
  return null
}
