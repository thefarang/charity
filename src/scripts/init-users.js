'use strict'

// @todo
// Test implementation
// Should this be run once, on system setup, or on each deployment?
// Each deployment
// Add to the gulpfile process

const servLog = require('../services/log')
const servDb = require('../services/database/facade')
const dataUsers = require('./data/users')

const init = async () => {
  try {
    servLog.info({}, 'Connecting to the dbase...')
    servDb.connect()

    const userPromises = []
    dataUsers.getUsers().forEach((currentUser) => {
      // The guest user is not written to the database
      if (currentUser.role.name === 'guest') {
        servLog.info({}, 'Ignoring the Guest user...')
        return
      }

      userPromises.push(new Promise(async (resolve, reject) => {
        try {
          servLog.info({}, `Populating the User ${currentUser.id}:${currentUser.email}...`)
          await servDb.getUserActions().saveUser(currentUser)
          return resolve()
        } catch (err) {
          servLog.info(
            { err: err },
            `An error occurred populating User ${currentUser.id}:${currentUser.email}`)
          return reject(err)
        }
      }))
    })
    await Promise.all(userPromises)

    servLog.info({}, 'Disconnecting from the dbase...')
    servDb.disconnect()
  } catch (err) {
    servLog.info({ err: err }, 'An error occurred during the default Users loading process')
  }
}

init()
