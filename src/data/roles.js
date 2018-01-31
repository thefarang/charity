'use strict'

const Role = require('../models/role')

const guestRole = new Role(1, 'guest')
const causeRole = new Role(2, 'cause')
const donatorRole = new Role(3, 'donator')
const adminRole = new Role(4, 'admin')

const getGuestRole = () => guestRole

const getCauseRole = () => causeRole

const getDonatorRole = () => donatorRole

const getAdminRole = () => adminRole

const getRoles = () => [ guestRole, causeRole, donatorRole, adminRole ]

module.exports = {
  getGuestRole,
  getCauseRole,
  getDonatorRole,
  getAdminRole,
  getRoles
}
