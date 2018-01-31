'use strict'

const User = require('../models/user')
const roles = require('./roles')

const guestUser = new User(
  '507f1f77bcf86cd799439011', 
  'guest@charity',
  'NOT USED',
  roles.getGuestRole()
)

// @todo
// Use .env config to insert password
const adminUser = new User(
  '507f1f77bcf86cd799439012', 
  'admin@charity',
  '@todo think about this, not secure!',
  roles.getAdminRole()
)

const getGuestUser = () => guestUser

const getAdminUser = () => adminUser

const getUsers = () => [ guestUser, adminUser ]

module.exports = {
  getGuestUser,
  getAdminUser,
  getUsers
}
