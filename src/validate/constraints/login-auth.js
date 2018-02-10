'use strict'

// @todo
// Inherit
const constraints = {
  email: {
    presence: true,
    length: {
      maximum: 50,
      message: "The email address should be less than 50 characters"
    },
    email: {
      message: "The email address is invalid"
    }
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "must be at least 6 characters"
    }
  }
}

module.exports = constraints
