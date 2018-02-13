'use strict'

const $ = require('jquery')
const Cookies = require('js-cookie')

const logoutId = '#logout'

const handleErrorEvent = (message, errorDivId, submitId) => {
  $(errorDivId).text(message)
  $(errorDivId).css("display", "block")
  $(submitId).prop("disabled", false)
}

const handleFormPreSubmit = (errorDivId, submitId) => {
  $(errorDivId).text("")
  $(errorDivId).css("display", "none")
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
  $(logoutId).on("click", () => {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/")
  })
}

module.exports = {
  handleErrorEvent,
  handleFormPreSubmit,
  handleBuildSchema,
  handleLogout
}
