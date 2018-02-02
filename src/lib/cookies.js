'use strict'

// Asks the browser to create a cookie called 'token', responsible
// for encapsulating the jwt on each request.
const setCookie = (res, token) => {
  res.cookie(
    'token',
    token,
    {
      /* @todo pull this from config */
      /* domain: '.example.com', */
      httpOnly: true
      /* secure: true */
    }
  )
}

// Asks the browser to clear the cookie containing the jwt.
const unsetCookie = (res) => {
  // The cookie options in clearCookie() must be the same as those
  // given when the cookie was created.
  res.clearCookie(
    'token',
    {
      /* @todo pull this from config */
      /* domain: '.example.com' */
      httpOnly: true
      /* secure: true */
    }
  )
}

module.exports = {
  setCookie,
  unsetCookie
}
