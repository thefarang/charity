'use strict'

const Role = require('../models/role')

const guestRole = new Role(1, 'guest')
const charityRole = new Role(2, 'charity')
const donatorRole = new Role(3, 'donator')
const adminRole = new Role(4, 'admin')

const getGuestRole = () => {
  return guestRole
}

const getCharityRole = () => {
  return charityRole
}

const getDonatorRole = () => {
  return donatorRole
}

const getAdminRole = () => {
  return adminRole
}

const getRoles = () => {
  return [
    guestRole,
    charityRole,
    donatorRole,
    adminRole
  ]
}

module.exports = {
  getGuestRole,
  getCharityRole,
  getDonatorRole,
  getAdminRole,
  getRoles
}
