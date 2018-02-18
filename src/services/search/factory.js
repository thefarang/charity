'use strict'

const elasticsearch = require('./elasticsearch/elasticsearch')
// const solr = require('./solr/solr')

module.exports = (searchEngine) => {
  if (searchEngine === 'elasticsearch') {
    return elasticsearch()
  }
  return null
}
