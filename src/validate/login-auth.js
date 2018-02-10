'use strict'

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

const validateSchema = (loginAuthSchema) => {
  const schema = ['email', 'password']
  return schema.every((schemaProperty) => {
    return (validate({ schemaProperty: loginAuthSchema[schemaProperty] }, LoginAuthConstraints) === null)
  })
}

module.exports = { 
  validateSchema
}
