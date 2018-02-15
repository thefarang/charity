'use strict'

const Action = require('oja').Action
const validate = require('validate.js')

const deps = {
  logService: null
}

class ValidateUIPolicy extends Action {
  async execute () {
    const context = await this.consume('context')
    const validationResult = validate(context.schema, context.constraints)
    if (validationResult) {
      const failResponse = { 
        status: 400,
        message: 'Login details failed data validation',
        data: validationResult }
      this.define('invalid-credentials', failResponse)
    }
    deps.logService.info({ schema: context.schema }, 'Login details passed data validation')
    this.define('valid-credentials', context)
  }
}

module.exports = (logService) => {
  deps.logService = logService
  return ValidateUIPolicy
}
