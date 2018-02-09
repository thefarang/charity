'use strict'

var $ = require('jquery')
// window.Popper = require('popper.js')  // popper.js provides the Bootstrap tooltips
var Popper = require('popper.js')
require('bootstrap')

function handleErrorEvent(message) {
  $("#errors").text(message)
  $("#errors").css("display", "block")
  $("#submit").prop("disabled", false)
}

$(function() {
  // LOGIN
  $("form").submit(function(e) {
    e.preventDefault()
  })

  $("#login_submit").on('click', function() {
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

  // REGISTER
  $("#register_submit").on('click', function() {
    // Ensure all fields are populated.
    if ((!$("#first_name").val()) || 
        (!$("#last_name").val()) ||
        (!$("#email").val()) ||
        (!$("#confirm_email").val()) ||
        (!$("#password").val()) ||
        (!$("#confirm_password").val())) {
      $("#errors").text("Please populate all fields")
      $("#errors").css("display", "block")
      return
    }

    // Ensure the email fields match
    if ($("#email").val() !== $("#confirm_email").val()) {
      $("#errors").text("The email addresses do not match")
      $("#errors").css("display", "block")
      return
    }

    // Ensure the password fields match
    if ($("#password").val() !== $("#confirm_password").val()) {
      $("#errors").text("The passwords do not match")
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
        200: function(data, textStatus, jqXHR) {
          window.location.replace(data.loc)
        },
        404: function(jqXHR, textStatus, errorThrown) {
          $("#errors").text(jqXHR.responseJSON.message)
          $("#errors").css("display", "block")
          $("#submit").prop("disabled", false)
        },
        500: function(jqXHR, textStatus, errorThrown) {
          $("#errors").text(jqXHR.responseJSON.message)
          $("#errors").css("display", "block")
          $("#submit").prop("disabled", false)
        }
      }
    })
  })
})
