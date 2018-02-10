'use strict'

const schemaProperties = ['email', 'password']

const buildSchema = (body) => {
  return {
    email: body.email,
    password: body.password
  }
}

const getProperties = () => schemaProperties

module.exports = {
  buildSchema,
  getProperties
}
