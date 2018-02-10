'use strict'

/*
const LoginConstraints = {
  first_name: {

  },
  last_name: {

  },
  email: {

  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "must be at least 6 characters"
    }
  }
}

const RegisterConstraints = {
  email: {
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "must be at least 6 characters"
    }
  }
}

const ChangePasswordConstraints = {
  email: {
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "must be at least 6 characters"
    }
  }
}
*/

// Login
// Sanitize
req.body.email = req.sanitize(req.body.email)
req.body.password = req.sanitize(req.body.password)

validate({ email: "test5@test.com" }, LoginConstraints)
validate({ password: "12345" }, LoginConstraints)
validate({ first_name: loginSchema.first_name }, RegisterUserConstraints)
validate({ lastname: "vcia" }, ChangePasswordConstraints)
validate({ email: "test5@test.com" }, RegisterConstraints)
validate({ confirm_email: "test5@test.com" }, RegisterConstraints)
validate({ password: req.body.current_password }, RegisterConstraints)
validate({ password: req.body.new_password }, RegisterConstraints)
validate({ confirm_password: req.body.confirm_new_password }, RegisterConstraints)
validate({ confirm_password: "12345" }, RegisterConstraints)

  // All good
  // Whitelist!


// src/models/UserFactory
  // UserFactory.createFromSchema(schema)
  // UserFactory.createFromUserAndSchema(user, schema)
// src/models/CharityFactory
    // CharityFactory.createFromSchema(schema)
    // CharityFactory.createFromCharityAndSchema(charity, schema)
// src/services/database/schema/UserSchemaFactory
    // UserSchemaFactory.createFromSchema(schema)
    // UserSchemaFactory.createFromUserAndSchema(user, schema)
// src/services/database/schema/CharitySchemaFactory
    // CharitySchemaFactory.createFromSchema(schema)
    // CharitySchemaFactory.createFromCharityAndSchema(charity, schema)

/*
const validators = {}
validators.loginAuth = require('../validate/login-auth')
validators.registerAuth = require('../validate/login-auth')
validators.loginAuth.validateSchema(input)
*/
// const validators = {
     // loginAuth: require(../validate/login-auth)
// }
// const validateLoginAuth = require(../validate/login-auth)
// const validateSchema = require(./validate/register-auth)
// const result = validateSchema(loginAuthSchema)
// if (result) // do something

// src/validate/constraints/email
// src/validate/constraints/password
// src/validate/login-auth
// src/validate/register-auth
// src/validate/charity-auth

// Inherit
const LoginAuthConstraints = {
  email: {
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "must be at least 6 characters"
    }
  }
}

const validateAll = (loginAuthSchema) => {
  let result = validate({ first_name: loginAuthSchema.email }, LoginAuthConstraints)
  if (result) return result
  validate({ lastname: loginAuthSchema.password }, LoginAuthConstraints)
  if (result) return result
}

module.exports = validateAll
