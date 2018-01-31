'use strict'

const dRoles = require('./roles')

const User = require('../models/user')
const Password = require('../models/password')

const guestUser = new User()
guestUser.id = '507f1f77bcf86cd799439011'
guestUser.email = 'guest@charity'
guestUser.password = new Password()
guestUser.role = dRoles.getGuestRole()

// @todo
// Use .env config to insert password
const adminPassword = new Password()
adminPassword.clrPassword = '<INSERT CONFIG FROM .ENV>'

const adminUser = new User()
adminUser.id = '507f1f77bcf86cd799439012'
adminUser.email = 'admin@charity'
adminUser.password = adminPassword
adminUser.role = dRoles.getAdminRole()

const getGuestUser = () => guestUser

const getAdminUser = () => adminUser

const getUsers = () => [ guestUser, adminUser ]

module.exports = {
  getGuestUser,
  getAdminUser,
  getUsers
}
