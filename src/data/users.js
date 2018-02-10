'use strict'

// This file should be used to:
// * Retrieve the Guest User details (the Guest User is not stored in the database)
// * Retrieve the Admin User details for saving to the database during system installion

const config = require('config')
const dataRoles = require('./roles')

const UserFactory = require('../models/user-factory')

const getGuestUser = () => {
  UserFactory.createFromSchema({
    user_id: config.get('system_users.guest.id'),
    user_email: config.get('system_users.guest.email'),
    user_role_id: dataRoles.getGuestRole().id,
    user_role_name: dataRoles.getGuestRole().name
  })
}

module.exports = {
  getGuestUser
}
