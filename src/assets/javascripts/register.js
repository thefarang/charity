'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../validate/constraints/register-auth')

let registerForm = null
const registerFormName = `form[name='register']`
const registerSubmitId = '#register_submit'
const errorDivId = '#errors'
const successDivId = '#success'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, registerSubmitId)
}

const handleSubmitSuccess = (data, textStatus, jqXHR) => {
  registerForm.trigger('reset')
  registerForm.css('display', 'none')
  $(successDivId).text(data.message)
}

const handleRegister = () => {
  registerForm = $(registerFormName)
  registerForm.submit((e) => e.preventDefault())

  $(registerSubmitId).on('click', () => {
    const schema = handlers.handleBuildSchema(registerForm)
    const errors = validate(schema, constraints)
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, registerSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, registerSubmitId)
    $.ajax({
      type: "POST",
      url: registerForm.attr('action'),
      data: schema,
      statusCode: {
        200: handleSubmitSuccess,
        400: handleSubmitFailure,
        404: handleSubmitFailure,
        500: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleRegister
}
