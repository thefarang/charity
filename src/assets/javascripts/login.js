'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const handleLogin = () => {
  handlers.handleFormSubmit()

  $("#login_submit").on('click', () => {
    if ((!$("#user_email").val()) || (!$("#user_password").val())) {
      $("#errors").text("Please populate all fields")
      $("#errors").css("display", "block")
      return
    }

    // Reset error message and prevent multiple form submissions
    $("#errors").text("")
    $("#errors").css("display", "none")
    $("#login_submit").prop("disabled", true)

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form[name='login']").attr('action'),
      data: $("form[name='login']").serialize(),
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
