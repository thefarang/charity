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
    case '/register-confirm':
      pageTitle += ' | Confirm Registration'
      routeTitle = 'Registration Status'
      break
    case '/dashboard/cause':
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
      pageTitle += ' | System Failure'
      routeTitle = 'System Failure'
      break
    case '/404':
      pageTitle += ' | Page Unavailable'
      routeTitle = 'Page Unavailable'
      break
  }
  return {
    brandTitle: config.get('app.brand'),
    pageTitle: pageTitle,
    routeTitle: routeTitle
  }
}

module.exports = getSEO
