'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const handleCharity = () => {
  $("form").submit((e) => e.preventDefault())

  $("#charity_submit").on('click', () => {
    handlers.handleFormPreSubmit('#charity_submit')

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form[name='charity']").attr('action'),
      data: $("form[name='charity']").serialize(),
      statusCode: {
        200: (data) => {
          window.location.replace("/dashboard/charity")
        },
        400: (jqXHR, textStatus, errorThrown) => {
          handlers.handleErrorEvent(jqXHR.responseJSON.message, "#charity_submit")
        },
        404: (jqXHR, textStatus, errorThrown) => {
          handlers.handleErrorEvent(jqXHR.responseJSON.message, "#charity_submit")
        },
        500: (jqXHR, textStatus, errorThrown) => {
          handlers.handleErrorEvent(jqXHR.responseJSON.message, "#charity_submit")
        }
      }
    })
  })
}

module.exports = {
  handleCharity
}