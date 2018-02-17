'use strict'

const $ = require('jquery')
const Popper = require('popper.js')
require('bootstrap')
const Awesomplete = require('awesomplete')

const handlers = require('./handlers')
const login = require('./login')
const register = require('./register')
const cause = require('./cause')
const resetPassword = require('./reset-password')

const keywordToUrlPath = (keyword) => {
  return keyword.replace(/ /g, '+')
}

$(() => {
  handlers.handleLogout()
  // Check page and bypass if not necessary
  login.handleLogin()
  // Check page and bypass if not necessary
  register.handleRegister()
  cause.handleCause()
  // Check page and bypass if not necessary
  resetPassword.handleResetPassword()
  
  // Check page and bypass if not necessary
  // @todo
  // 1/ Ensure that the selected sort value is also sent to the server
  // 2/ Clean up the code
  // 3/ Implement pagination
  const autocomplete = new Awesomplete(
    document.getElementById("cause-search"),
    {
      minChars: 3,
      maxItems: 15
    })
  
  // Called onclick
  Awesomplete.$('#cause-search').addEventListener('awesomplete-selectcomplete', (event) => {
    event.preventDefault()
    const keyword = 'keyword=' + keywordToUrlPath(event.text.value)
    const sort = 'sort=' + $('#cause-sort').val()
    const path = keyword + '&' + sort
    window.location.replace('/explore?' + path)
  })

  $('#cause-sort').on('change', () => {
    let keyword = null
    if ($('#cause-search').val().length >= 3) {
      keyword = 'keyword=' + keywordToUrlPath($('#cause-search').val())
    }
    const sort = 'sort=' + $('#cause-sort').val()
    const path = (keyword) ? keyword + '&' + sort : sort
    window.location.replace('/explore?' + path)
  })

  $('#cause-search').on('keypress', (event) => {
    // Check if return button pressed
    if (event.which === 13) {
      if ($('#cause-search').val().length === 0) {
        // Reset the page
        const sort = 'sort=' + $('#cause-sort').val()
        window.location.replace('/explore?' + sort)
      } else if ($('#cause-search').val().length >= 3) {
        const keyword = 'keyword=' + keywordToUrlPath($('#cause-search').val())
        const sort = 'sort=' + $('#cause-sort').val()
        const path = keyword + '&' + sort
        window.location.replace('/explore?' + path)
      }
      return
    }

    if ($('#cause-search').val().length < 3) {
      return
    }

    $.ajax({
      type: "POST",
      url: '/search',
      data: { keyword: $('#cause-search').val() },
      statusCode: {
        200: (data, textStatus, jqXHR) => {
          console.log(data)
          autocomplete.list = data
        }
      }
    })
  })
})
