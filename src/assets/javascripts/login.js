'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('./validate')

const handleLogin = () => {
  handlers.handleFormSubmit()

  $("#login_submit").on('click', () => {

    const schema = validate.handleBuildSchema($( "form[name='login']" ))
    const errors = validate.handleValidateSchema(schema)
    if (errors) {
      console.log(errors)
      handlers.handleErrorEvent(errors, '#login_submit')
      return
    }

    handlers.handleErrorReset()

    $.ajax({
      type: "POST",
      url: $("form[name='login']").attr('action'),
      data: schema,
      statusCode: {
        200: (data) => {
          window.location.replace(data.loc)
        },
        400: () => {
          handlers.handleErrorEvent("The email or password is incorrect.", "#login_submit")
        },
        401: () => {
          handlers.handleErrorEvent("The email or password is incorrect.", "#login_submit")
        },
        404: () => {
          handlers.handleErrorEvent("The email or password is incorrect.", "#login_submit")
        }
      }
    })
  })
}

module.exports = {
  handleLogin
}
