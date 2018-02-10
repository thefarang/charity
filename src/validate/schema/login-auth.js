'use strict'

const schemaProperties = ['email', 'password']

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
