'use strict'

// Run by gulp

const servLog = require('../services/log')
const servDb = require('../services/database/facade')
const dataUsers = require('../data/users')

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

      // Push the relevant save/update action onto the list of save/update actions.
      userPromises.push(new Promise(async (resolve, reject) => {
        try {
          // In data/users (from which we retrieved the currentUser object) we only store the clrPassword.
          // Therefore generate the encPassword from this, as the encPassword is what is stored in the database
          servLog.info({}, `Generating encrypted password for ${currentUser.id}:${currentUser.email}...`)
          currentUser.password.encPassword =
            await currentUser.password.getEncPasswordFromClearPassword(currentUser.password.clrPassword)

          const existingUser = await servDb.getUserActions().findUserByEmail(currentUser.email)
          if (!existingUser) {
            servLog.info({}, `Creating new User ${currentUser.id}:${currentUser.email}...`)
            await servDb.getUserActions().saveNewUser(currentUser)
          } else {
            servLog.info({}, `Updating existing User ${currentUser.id}:${currentUser.email}...`)
            await servDb.getUserActions().updateUser(currentUser)
          }
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
