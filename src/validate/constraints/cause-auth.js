'use strict'

// @todo
// Inherit
const CauseAuthConstraints = {
  cause_name: {
    format: {
      pattern: "[\. a-zA-Z0-9-]*",
      flags: "i",
      message: "^The cause name contains invalid characters"
    },
    length: {
      maximum: 50,
      message: "^We can only store a cause name that is less than 50 characters long"
    }
  },
  cause_country: {
    format: {
      pattern: "[ a-zA-Z]*",
      flags: "i",
      message: "^The country name contains invalid characters"
    },
    length: {
      maximum: 100,
      message: "^The country name should be less than 100 characters long"
    }
  }
}

module.exports = CauseAuthConstraints
