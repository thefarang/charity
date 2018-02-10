'use strict'

const schemaProperties = [
  'charity_id',
  'is_visible',
  'name',
  'country',
  'is_registered',
  'website',
  'email',
  'phone',
  'short_desc',
  'long_desc',
  'keyword_1',
  'keyword_2'
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
