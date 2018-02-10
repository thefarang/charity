'use strict'

// @todo
// Inherit
const constraints = {
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
  email: {
    presence: true,
    email: {
      message: "The email address is invalid"
    },
    length: {
      maximum: 50,
      message: "The email address should be less than 50 characters"
    }
  },
  confirm_email: {
    equality: {
      attribute: "email",
      message: "The email addresses do not match"
    }
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "The password must be at least 6 characters long"
    }
  },
  confirm_password: {
    equality: {
      attribute: "password",
      message: "The passwords do not match"
    }
  }
}

module.exports = constraints
