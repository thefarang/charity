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

const getRoleByName = (name) => {
  switch (name) {
    case 'guest': return guestRole
    case 'cause': return causeRole
    case 'donator': return donatorRole
    case 'admin': return adminRole
    default: throw new Error('Unknown role name provided')
  }
}

module.exports = {
  getGuestRole,
  getCauseRole,
  getDonatorRole,
  getAdminRole,
  getRoles,
  getRoleByName
}
