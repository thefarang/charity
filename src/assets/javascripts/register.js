'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const handleRegister = () => {
  handlers.handleFormSubmit()

  $("#register_submit").on('click', () => {
    // Ensure all fields are populated.
    if ((!$("#first_name").val()) || 
        (!$("#last_name").val()) ||
        (!$("#user_email").val()) ||
        (!$("#confirm_user_email").val()) ||
        (!$("#user_password").val()) ||
        (!$("#confirm_user_password").val())) {
      $("#errors").text("Please populate all fields")
      $("#errors").css("display", "block")
      return
    }

    // Ensure the email fields match
    if ($("#user_email").val() !== $("#confirm_user_email").val()) {
      $("#errors").text("The email addresses do not match")
      $("#errors").css("display", "block")
      return
    }

    // Ensure the password fields match
    if ($("#user_password").val() !== $("#confirm_user_password").val()) {
      $("#errors").text("The passwords do not match")
      $("#errors").css("display", "block")
      return
    }

    // Reset error message and prevent multiple form submissions
    $("#errors").text("")
    $("#errors").css("display", "none")
    $("#register_submit").prop("disabled", true)

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form[name='register']").attr('action'),
      data: $("form[name='register']").serialize(),
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
