'use strict'

const schemaProperties = [
  'first_name',
  'last_name',
  'email',
  'confirm_email',
  'password',
  'confirm_password'
]

const buildSchema = (body) => {
  const schema = {}
  schemaProperties.forEach((property) => {
    schema[property] = body[property]
  })
  return schema
}

const getProperties = () => schemaProperties

module.exports = {
  buildSchema,
  getProperties
}
