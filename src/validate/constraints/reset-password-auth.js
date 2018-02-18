'use strict'

// @todo
// Inherit
const ResetPasswordAuthConstraints = {
  user_email: {
    presence: true,
    length: {
      maximum: 50,
      message: "The email address should be less than 50 characters"
    },
    email: {
      message: "The email address is invalid"
    }
  }
}

module.exports = ResetPasswordAuthConstraints
