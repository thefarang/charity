'use strict'

var $ = require('jquery')
// window.Popper = require('popper.js')  // popper.js provides the Bootstrap tooltips
var Popper = require('popper.js')
require('bootstrap')
var Cookies = require('js-cookie')

function handleErrorEvent(message, submitId) {
  $("#errors").text(message)
  $("#errors").css("display", "block")
  $(submitId).prop("disabled", false)
}

$(function() {
  // ALL LOGOUTS
  $("#logout").on("click", function() {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/login")
  })

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
    $("#login_submit").prop("disabled", true)

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form[name='login']").attr('action'),
      data: $("form[name='login']").serialize(),
      statusCode: {
        200: function(data) {
          window.location.replace(data.loc)
        },
        401: function() {
          handleErrorEvent("The email or password is incorrect.", "#login_submit")
        },
        404: function() {
          handleErrorEvent("The email or password is incorrect.", "#login_submit")
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
    $("#register_submit").prop("disabled", true)

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form[name='register']").attr('action'),
      data: $("form[name='register']").serialize(),
      statusCode: {
        200: function(data, textStatus, jqXHR) {
          window.location.replace(data.loc)
        },
        404: function(jqXHR, textStatus, errorThrown) {
          handleErrorEvent(jqXHR.responseJSON.message, "#register_submit")
        },
        500: function(jqXHR, textStatus, errorThrown) {
          handleErrorEvent(jqXHR.responseJSON.message, "#register_submit")
        }
      }
    })
  })

  // CHARITY DETAILS
  $("#charity_submit").on('click', function() {
    // Reset error message and prevent multiple form submissions
    $("#errors").text("")
    $("#errors").css("display", "none")
    $("#charity_submit").prop("disabled", true)

    // Post the form data to the server
    $.ajax({
      type: "POST",
      url: $("form[name='charity']").attr('action'),
      data: $("form[name='charity']").serialize(),
      statusCode: {
        200: function(data) {
          window.location.replace("/dashboard/charity")
        },
        404: function(jqXHR, textStatus, errorThrown) {
          handleErrorEvent(jqXHR.responseJSON.message, "#charity_submit")
        },
        500: function(jqXHR, textStatus, errorThrown) {
          handleErrorEvent(jqXHR.responseJSON.message, "#charity_submit")
        }
      }
    })
  })
})
