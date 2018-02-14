'use strict'

const config = require('config')
const elasticsearch = require('elasticsearch')
const servLog = require('../../log')
const CauseFactory = require('../../../factories/cause-factory')
const CauseFromSearchTypeMapping = require('./mappings/cause-from-search-type')

let client = null

// @todo critical - reconnect if connection drops
const connect = () => {
  client = new elasticsearch.Client({
    host: `${config.get('search.elasticsearch.search_conn')}`,
    log: 'info'
  })
}

// @todo here
const disconnect = () => {
}

/*
const findCauseById = (causeId) => {
  const searchParams = {
    index: config.get('search.elasticsearch.index'),
    type: 'cause',
    // from: (pageNum - 1) * perPage,
    size: 1,
    body: {
      query: {
        term: {
          _id: causeId
        }
      }
    }
  }
}
*/

const findCauseByUserId = (userId) => {
  const searchParams = {
    index: config.get('search.elasticsearch.index'),
    type: 'cause',
    /* from: (pageNum - 1) * perPage, */
    size: 1,
    body: {
      query: {
        term: {
          userId: userId
        }
      }
    }
  }

  return new Promise((resolve, reject) => {
    client.search(searchParams, (err, response, status) => {
      if (err) {
        servLog.info({ err: err, status: status, userId: userId }, 'Error locating Cause by User.id')
        return reject(err)
      }

      if (response.hits.total !== 1) {
        servLog.info({ userId: userId }, 'Could not locate the Cause by User id')
        return resolve(null)
      }
      return resolve(CauseFactory.createCause(response.hits.hits[0], CauseFromSearchTypeMapping))
    })
  })
}

const saveNewCause = (cause) => {
  return new Promise((resolve, reject) => {
    client.index({
      index: config.get('search.elasticsearch.index'),
      type: 'cause',
      body: {
        "userId": cause.userId,
        "name": cause.name,
        "country": cause.country
      }
    }, (err, response, status) => {

      if (err) {
        servLog.info({ err: err, status: status, userId: cause.userId }, 'Error saving a new Cause')
        return reject(err)
      }

      servLog.info({ causeId: response._id, userId: cause.userId }, 'Successfully saved new Cause')
      return resolve(CauseFactory.createCause(response, CauseFromSearchTypeMapping))
    })
  })
}

const updateCause = (cause) => {
  return new Promise((resolve, reject) => {
    client.index({
      index: config.get('search.elasticsearch.index'),
      type: 'cause',
      id: cause.id,
      body: {
        "userId": cause.userId,
        "name": cause.name,
        "country": cause.country
      }
    }, (err, response, status) => {

      if (err) {
        servLog.info({ err: err, status: status, userId: cause.userId }, 'Error updating Cause')
        return reject(err)
      }
      servLog.info({ cause: cause }, 'Successfully updated Cause')
      return resolve(cause)
    })
  })
}

const search = async () => {
  const searchParams = {
    index: config.get('search.elasticsearch.index'),
    type: 'cause',
    /* from: (pageNum - 1) * perPage, */
    size: 20,   // @todo parameterise
    body: {
      query: {
        match_all: {}
      }
    }
  }

  return new Promise((resolve, reject) => {
    client.search(searchParams, (err, response, status) => {
      if (err) {
        servLog.info({ err: err, status: status }, 'Error locating Cause documents')
        return reject(err)
      }

      const causes = []
      response.hits.hits.forEach((hit) => {
        causes.push(CauseFactory.createCause(hit, CauseFromSearchTypeMapping))
      })
      return resolve(causes)
    })
  })
}

/*
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
    results.hits.hits.forEach(
      (hit, index) => console.log(
        `\t${body.from + ++index} - ${hit._source.title}`
      )
    )
  } catch (err) {
  }
}
*/

module.exports = () => {
  connect()
  return {
    connect,
    disconnect,
    /*findCauseById,*/
    findCauseByUserId,
    saveNewCause,
    updateCause,
    search
  }
}
