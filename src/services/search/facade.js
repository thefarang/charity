'use strict'

const config = require('config')
const elasticsearch = require('elasticsearch')

const servLog = require('../log')
const Charity = require('../../models/charity')

let client = null

// @todo critical - reconnect if connection drops
const connect = () => {
  client = new elasticsearch.Client({
    host: `${config.get('search.search_conn')}`,
    log: 'info'
  })
}

const disconnect = () => {
  // @todo here
}

const findCharityById = (charityId) => {
  const searchParams = {
    index: config.get('search.index'),
    type: 'charity',
    /* from: (pageNum - 1) * perPage, */
    size: 1,
    body: {
      query: {
        term: {
          _id: charityId
        }
      }
    }
  }

  return new Promise((resolve, reject) => {
    client.search(searchParams, (err, response, status) => {
      if (err) {
        servLog.info({ 
          err: err,
          status: status,
          charityId: charityId }, 
          'An error occurred locating the Charity by Charity.id')
        return reject(err)
      }

      if (response.hits.total !== 1) {
        servLog.info({ 
          charityId: charityId },
          'Could not locate the Charity by id')
        return resolve(null)
      }

      const charity = new Charity()
      charity.id =  response.hits.hits[0]._id
      charity.userId = response.hits.hits[0]._source.userId
      charity.isVisible = response.hits.hits[0]._source.isVisible
      charity.name = response.hits.hits[0]._source.name
      charity.country = response.hits.hits[0]._source.country
      charity.isRegistered = response.hits.hits[0]._source.isRegistered
      charity.website = response.hits.hits[0]._source.website
      charity.email = response.hits.hits[0]._source.email
      charity.phone = response.hits.hits[0]._source.phone
      charity.shortDesc = response.hits.hits[0]._source.shortDesc
      charity.longDesc = response.hits.hits[0]._source.longDesc
      charity.imageThumb = response.hits.hits[0]._source.imageThumb
      charity.imageFull = response.hits.hits[0]._source.imageFull
      charity.coinhiveKey = response.hits.hits[0]._source.coinhiveKey
      charity.keywords = response.hits.hits[0]._source.keywords
      return resolve(charity)
    })
  })
}

const findCharityByUserId = (userId) => {
  const searchParams = {
    index: config.get('search.index'),
    type: 'charity',
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
        servLog.info({ 
          err: err,
          status: status,
          userId: userId }, 
          'An error occurred locating the Charity by User.id')
        return reject(err)
      }

      if (response.hits.total !== 1) {
        servLog.info({ 
          userId: userId },
          'Could not locate the Charity by User id')
        return resolve(null)
      }

      const charity = new Charity()
      charity.id =  response.hits.hits[0]._id
      charity.userId = response.hits.hits[0]._source.userId
      charity.isVisible = response.hits.hits[0]._source.isVisible
      charity.name = response.hits.hits[0]._source.name
      charity.country = response.hits.hits[0]._source.country
      charity.isRegistered = response.hits.hits[0]._source.isRegistered
      charity.website = response.hits.hits[0]._source.website
      charity.email = response.hits.hits[0]._source.email
      charity.phone = response.hits.hits[0]._source.phone
      charity.shortDesc = response.hits.hits[0]._source.shortDesc
      charity.longDesc = response.hits.hits[0]._source.longDesc
      charity.imageThumb = response.hits.hits[0]._source.imageThumb
      charity.imageFull = response.hits.hits[0]._source.imageFull
      charity.coinhiveKey = response.hits.hits[0]._source.coinhiveKey
      charity.keywords = response.hits.hits[0]._source.keywords
      return resolve(charity)
    })
  })
}

const saveNewCharity = (charity) => {
  return new Promise((resolve, reject) => {
    client.index({
      index: config.get('search.index'),
      type: 'charity',
      body: {
        "userId": charity.userId,
        "isVisible": charity.isVisible,
        "name": charity.name,
        "country": charity.country,
        "isRegistered": charity.isRegistered,
        "website": charity.website,
        "email": charity.email,
        "phone": charity.phone,
        "shortDesc": charity.shortDesc,
        "longDesc": charity.longDesc,
        "imageThumb": charity.imageThumb,
        "imageFull": charity.imageFull,
        "coinhiveKey": charity.coinhiveKey,
        "keywords": charity.keywords
      }
    }, (err, response, status) => {

      if (err) {
        servLog.info({ 
          err: err, 
          status: status,
          userId: charity.userId }, 
          'An error occurred saving a new Charity')
        return reject(err)
      }

      servLog.info({
        charityId: response._id,
        userId: charity.userId },
        'Successfully saved a new Charity')

      charity.id = response._id
      return resolve(charity)
    })
  })
}

const updateCharity = (charity) => {
  return new Promise((resolve, reject) => {
    client.index({
      index: config.get('search.index'),
      type: 'charity',
      id: charity.id,
      body: {
        "userId": charity.userId,
        "isVisible": charity.isVisible,
        "name": charity.name,
        "country": charity.country,
        "isRegistered": charity.isRegistered,
        "website": charity.website,
        "email": charity.email,
        "phone": charity.phone,
        "shortDesc": charity.shortDesc,
        "longDesc": charity.longDesc,
        "imageThumb": charity.imageThumb,
        "imageFull": charity.imageFull,
        "coinhiveKey": charity.coinhiveKey,
        "keywords": charity.keywords
      }
    }, (err, response, status) => {

      if (err) {
        servLog.info({ 
          err: err, 
          status: status,
          userId: charity.userId }, 
          'Error occurred updating a Charity')
        return reject(err)
      }

      servLog.info({ charity: charity }, 'Successfully updated a Charity')
      return resolve(charity)
    })
  })
}

const searchKeyword = async (keyword) => {
  /*
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
  */
}

const searchCharityName = (name) => {
}

module.exports = {
  connect,
  disconnect,
  findCharityById,
  findCharityByUserId,
  saveNewCharity,
  updateCharity,
  searchKeyword,
  searchCharityName
}
