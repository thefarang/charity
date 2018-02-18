'use strict'

// @todo
// Inherit
const LoginAuthConstraints = {
  user_email: {
    presence: true,
    length: {
      maximum: 50,
      message: "The email address should be less than 50 characters"
    },
    email: {
      message: "The email address is invalid"
    }
  },
  user_password: {
    presence: true,
    length: {
      minimum: 6,
      message: "The password must be at least 6 characters long"
    }
  }
}

module.exports = LoginAuthConstraints
