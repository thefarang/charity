'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../validate/constraints/cause-auth')

let causeForm = null
const causeFormName = `form[name='cause']`
const causeSubmitId = '#cause_submit'
const errorDivId = '#errors'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, causeSubmitId)
}

const handleCause = () => {
  causeForm = $(causeFormName)
  causeForm.submit((e) => e.preventDefault())

  $(causeSubmitId).on('click', () => {
    const schema = handlers.handleBuildSchema(causeForm)
    const errors = validate(schema, constraints)
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, causeSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, causeSubmitId)
    $.ajax({
      type: "POST",
      url: causeForm.attr('action'),
      data: causeForm.serialize(),
      statusCode: {
        200: (data) => {
          window.location.replace(data.loc)
        },
        400: handleSubmitFailure,
        404: handleSubmitFailure,
        500: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleCause
}
