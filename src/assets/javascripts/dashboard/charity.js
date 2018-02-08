'use strict'

var $ = require('jquery')
var Cookies = require('js-cookie')

$(function() {
  $("#logout").on("click", function() {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/login")
  })

  $("form").submit(function(e) {
    e.preventDefault()
  })

  $("#submit").on('click', function() {
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
          window.location.replace("/dashboard")
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
