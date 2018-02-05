'use strict'

const config = require('config')
const elasticsearch = require('elasticsearch')

const servLog = require('../log')
const charityActions = require('./actions/charities')

const esClient = new elasticsearch.Client({
  host: 'http://search:9200',
  log: 'error'
})

const searchKeyword = async (keyword) => {
  const index = 'keyword'
  const body = {
    from: 0,
    size: 20,
    query: {
      match_all: {}
    }
  }

  try {
    const results = await esClient.search({ index: index, body: body })
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    console.log(`returned keywords:`);
    /*
    results.hits.hits.forEach(
      (hit, index) => console.log(
        `\t${body.from + ++index} - ${hit._source.title}`
      )
    )
    */
  } catch (err) {

  }
}

const searchCauseName = (name) => {
}

const searchCauseLocation = (location) => {
}

const search = (body) => {

}

module.exports = {
  searchKeyword,
  searchCauseName,
  searchCauseLocation,
  search
}
