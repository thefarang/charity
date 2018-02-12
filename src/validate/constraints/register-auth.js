'use strict'

const UserRoles = require('../../data/user-roles')

// Create the inclusions for validating the correct role
const userRoles = [ UserRoles.CAUSE, UserRoles.DONATOR ]

// @todo
// Inherit
const RegisterAuthConstraints = {
  first_name: {
    presence: true,
    format: {
      pattern: "[a-zA-Z]+",
      flags: "i",
      message: "The first name can only contain letters"
    },
    length: {
      maximum: 25,
      message: "The first name needs to be less than 25 characters long"
    }
  },
  last_name: {
    presence: true,
    format: {
      pattern: "[a-zA-Z]+",
      flags: "i",
      message: "The last name can only contain letters"
    },
    length: {
      maximum: 25,
      message: "The last name needs to be less than 25 characters long"
    }
  },
  user_email: {
    presence: true,
    email: {
      message: "The email address is invalid"
    },
    length: {
      maximum: 50,
      message: "The email address should be less than 50 characters"
    }
  },
  confirm_user_email: {
    equality: {
      attribute: "user_email",
      message: "The email addresses do not match"
    }
  },
  user_password: {
    presence: true,
    length: {
      minimum: 6,
      message: "The password must be at least 6 characters long"
    }
  },
  confirm_user_password: {
    equality: {
      attribute: "user_password",
      message: "The passwords do not match"
    }
  },
  user_role: {
    presence: true,
    inclusion: {
      within: userRoles
    }
  }
}

module.exports = RegisterAuthConstraints
