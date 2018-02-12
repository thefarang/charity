'use strict'

const $ = require('jquery')
const Cookies = require('js-cookie')

const handleErrorEvent = (message, submitId) => {
  $("#errors").text(message)
  $("#errors").css("display", "block")
  $(submitId).prop("disabled", false)
}

const handleErrorReset = () => {
  // Reset error message and prevent multiple form submissions
  $("#errors").text("")
  $("#errors").css("display", "none")
  $("#login_submit").prop("disabled", true)
}

const handleFormSubmit = () => {
  $("form").submit((e) => {
    e.preventDefault()
  })
}

const handleLogout = () => {
  $("#logout").on("click", () => {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/login")
  })
}

module.exports = {
  handleErrorEvent,
  handleErrorReset,
  handleFormSubmit,
  handleLogout
}
