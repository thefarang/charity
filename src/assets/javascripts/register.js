'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../validate/constraints/register-auth')

const handleRegister = () => {
  $("form").submit((e) => e.preventDefault())

  $("#register_submit").on('click', () => {
    const schema = handlers.handleBuildSchema($( "form[name='register']" ))
    const errors = validate(schema, constraints)
    if (errors) {
      console.log(errors)
      handlers.handleErrorEvent(errors, '#register_submit')
      return
    }

    handlers.handleFormPreSubmit('#register_submit')

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form[name='register']").attr('action'),
      data: schema,
      statusCode: {
        200: (data, textStatus, jqXHR) => {
          window.location.replace(data.loc)
        },
        400: (jqXHR, textStatus, errorThrown) => {
          handlers.handleErrorEvent(jqXHR.responseJSON.message, "#register_submit")
        },
        404: (jqXHR, textStatus, errorThrown) => {
          handlers.handleErrorEvent(jqXHR.responseJSON.message, "#register_submit")
        },
        500: (jqXHR, textStatus, errorThrown) => {
          handlers.handleErrorEvent(jqXHR.responseJSON.message, "#register_submit")
        }
      }
    })
  })
}

module.exports = {
  handleRegister
}
