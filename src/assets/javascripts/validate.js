'use strict'

const $ = require('jquery')
const validate = require('validate.js')
const loginAuthConstraints = require('../../validate/constraints/login-auth')

const handleBuildSchema = (form) => {
  const schema = {}
  const schemaProperties = form.serializeArray()
  $.each( schemaProperties, ( i, schemaProperty ) => {
    schema[schemaProperty.name] = schemaProperty.value
  })
  return schema
}

const handleValidateSchema = (schema) => validate(schema, loginAuthConstraints)

module.exports = {
  handleBuildSchema,
  handleValidateSchema
}
