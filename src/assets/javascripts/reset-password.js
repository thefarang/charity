'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../validate/constraints/reset-password-auth')

let resetPasswordForm = null
const resetPasswordFormName = `form[name='reset-password']`
const resetSubmitId = '#reset_submit'
const errorDivId = '#errors'
const successDivId = '#success'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, resetSubmitId)
}

const handleSubmitSuccess = (data, textStatus, jqXHR) => {
  resetPasswordForm.trigger('reset')
  resetPasswordForm.css('display', 'none')
  $(successDivId).text(data.message)
}

const handleResetPassword = () => {
  resetPasswordForm = $(resetPasswordFormName)
  resetPasswordForm.submit((e) => e.preventDefault())

  $(resetSubmitId).on('click', () => {
    const schema = handlers.handleBuildSchema(resetPasswordForm)
    const errors = validate(schema, constraints)
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, resetSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, resetSubmitId)
    $.ajax({
      type: "POST",
      url: resetPasswordForm.attr('action'),
      data: schema,
      statusCode: {
        200: handleSubmitSuccess,
        400: handleSubmitFailure,
        401: handleSubmitFailure,
        404: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleResetPassword
}
