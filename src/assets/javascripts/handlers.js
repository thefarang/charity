'use strict'

const $ = require('jquery')
const Cookies = require('js-cookie')

const handleErrorEvent = (message, submitId) => {
  $("#errors").text(message)
  $("#errors").css("display", "block")
  $(submitId).prop("disabled", false)
}

const handleFormPreSubmit = (submitId) => {
  $("#errors").text("")
  $("#errors").css("display", "none")
  $(submitId).prop("disabled", true)
}

const handleBuildSchema = (form) => {
  const schema = {}
  const schemaProperties = form.serializeArray()
  $.each( schemaProperties, ( i, schemaProperty ) => {
    schema[schemaProperty.name] = schemaProperty.value
  })
  return schema
}

const handleLogout = () => {
  $("#logout").on("click", () => {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/login")
  })
}

module.exports = {
  handleErrorEvent,
  handleFormPreSubmit,
  handleBuildSchema,
  handleLogout
}
