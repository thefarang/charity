'use strict'

const config = require('config')

const getSEO = (title) => {
  let pageTitle = `${config.get('app.brand')}`
  let routeTitle = null
  switch (title) {
    case '/':
      pageTitle += ' | Home'
      routeTitle = 'Home'
      break
    case '/explore':
      pageTitle += ' | Explore Charities'
      routeTitle = 'Explore'
      break
    case '/faq':
      pageTitle += ' | Faq'
      routeTitle = 'Frequently Asked Questions'
      break
    case '/login':
      pageTitle += ' | Login'
      routeTitle = 'Login'
      break
    case '/register':
      pageTitle += ' | Register'
      routeTitle = 'Register'
      break
    case '/dashboard/charity':
    case '/dashboard/admin':
      pageTitle += ' | Dashboard'
      routeTitle = 'Dashboard'
      break
    case '/terms':
      pageTitle += ' | Terms of Service'
      routeTitle = 'Terms of Service'
      break
    case '/reset-password':
      pageTitle += ' | Reset Password'
      routeTitle = 'Reset Password'
      break
    case '/error':
      pageTitle += ' | Error'
      routeTitle = 'Error'
      break
    case '/404':
      pageTitle += ' | Unknown'
      routeTitle = 'Unknown Route'
      break
  }
  return { pageTitle: pageTitle, routeTitle: routeTitle }
}

module.exports = getSEO
