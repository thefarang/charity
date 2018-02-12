'use strict'

const $ = require('jquery')
const Cookies = require('js-cookie')

const handleErrorEvent = (message, submitId) => {
  $("#errors").text(message)
  $("#errors").css("display", "block")
  $(submitId).prop("disabled", false)
}

const handleLogout = () => {
  $("#logout").on("click", () => {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/login")
  })
}

const handleFormSubmit = () => {
  $("form").submit((e) => {
    e.preventDefault()
  })
}

module.exports = {
  handleErrorEvent,
  handleLogout,
  handleFormSubmit
}
