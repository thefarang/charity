'use strict'

var $ = require('jquery')
var Cookies = require('js-cookie')

$(function() {
  $("#logout").on("click", function() {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/login")
  })
})
