'use strict'

class UseCaseContext  {
  constructor(schema, constraints, schematoUserMapping, res) {
    this.schema = schema
    this.constraints = constraints
    this.schematoUserMapping = schematoUserMapping
    // Express Response object
    this.res = res

    // Dynamic variables for holding response to the context
    this.status = null
    this.message = null
    this.action = null
    this.data = null
    this.user = null
  }
}

module.exports = UseCaseContext
