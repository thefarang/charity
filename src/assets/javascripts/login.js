'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../validate/constraints/login-auth')

let loginForm = null
const loginFormName = `form[name='login']`
const loginSubmitId = '#login_submit'
const errorDivId = '#errors'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId,loginSubmitId)
}

const handleLogin = () => {
  loginForm = $(loginFormName)
  loginForm.submit((e) => e.preventDefault())

  $(loginSubmitId).on('click', () => {
    const schema = handlers.handleBuildSchema(loginForm)
    const errors = validate(schema, constraints)
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, loginSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, loginSubmitId)
    $.ajax({
      type: "POST",
      url: loginForm.attr('action'),
      data: schema,
      statusCode: {
        200: (data, textStatus, jqXHR) => {
          window.location.replace(data.loc)
        },
        400: handleSubmitFailure,
        401: handleSubmitFailure,
        404: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleLogin
}
