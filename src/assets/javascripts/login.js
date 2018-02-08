'use strict'

var $ = require('jquery')

function handleErrorEvent(message) {
  $("#errors").text(message)
  $("#errors").css("display", "block")
  $("#submit").prop("disabled", false)
}

$(function() {
  $("form").submit(function(e) {
    e.preventDefault()
  })

  $("#submit").on('click', function() {
    if ((!$("#email").val()) || (!$("#password").val())) {
      $("#errors").text("Please populate all fields")
      $("#errors").css("display", "block")
      return
    }

    // Reset error message and prevent multiple form submissions
    $("#errors").text("")
    $("#errors").css("display", "none")
    $("#submit").prop("disabled", true)

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form").attr('action'),
      data: $("form").serialize(),
      statusCode: {
        200: function(data) {
          window.location.replace(data.loc)
        },
        401: function() {
          handleErrorEvent("The email or password is incorrect.")
        },
        404: function() {
          handleErrorEvent("The email or password is incorrect.")
        }
      }
    })
  })
})
