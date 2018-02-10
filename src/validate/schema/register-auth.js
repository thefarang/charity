'use strict'

const schemaProperties = [
  'first_name',
  'last_name',
  'user_email',
  'confirm_user_email',
  'user_password',
  'confirm_user_password',
  'user_role_id',
  'user_role_name'
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
