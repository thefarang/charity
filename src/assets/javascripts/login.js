'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../validate/constraints/login-auth')

const handleLogin = () => {
  $("form").submit((e) => e.preventDefault())

  $("#login_submit").on('click', () => {
    const schema = handlers.handleBuildSchema($( "form[name='login']" ))
    const errors = validate(schema, constraints)
    if (errors) {
      console.log(errors)
      handlers.handleErrorEvent(errors, '#login_submit')
      return
    }

    handlers.handleFormPreSubmit('#login_submit')

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
