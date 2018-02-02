'use strict'

// This file should be used to:
// * Retrieve the Guest User details (the Guest User is not stored in the database)
// * Retrieve the Admin User details for saving to the database during system installion

const config = require('config')

const dataRoles = require('./roles')

const User = require('../models/user')
const Password = require('../models/password')

const guestUser = new User()
guestUser.id = config.get('system_users.guest.id')
guestUser.email = config.get('system_users.guest.email')
guestUser.password = new Password()
guestUser.role = dataRoles.getGuestRole()

const adminUser = new User()
adminUser.id = config.get('system_users.admin.id')
adminUser.email = config.get('system_users.admin.email')
const adminPassword = new Password()
adminPassword.clrPassword = config.get('system_users.admin.clrPassword')
adminUser.password = adminPassword
adminUser.role = dataRoles.getAdminRole()

const getGuestUser = () => guestUser

const getAdminUser = () => adminUser

const getUsers = () => [ guestUser, adminUser ]

module.exports = {
  getGuestUser,
  getAdminUser,
  getUsers
}
