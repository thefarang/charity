'use strict'

const config = require('config')

// @todo
// Update this to return more information, e.g:
// { pageTitle: "Brand | Login", title: "Login" }
const getTitle = (title) => {
  let seoTitle = `${config.get('app.brand')}`
  switch (title) {
    case '/': seoTitle += ' | Home'; break
    case '/explore': seoTitle += ' | Explore Charities'; break
    case '/faq': seoTitle += ' | Faq'; break
    case '/login': seoTitle += ' | Login'; break
    case '/register': seoTitle += ' | Register'; break
    case '/dashboard/charity':
    case '/dashboard/admin':
      seoTitle += ' | Dashboard'
      break
    case '/terms': seoTitle += ' | Terms of Service'; break
    case '/reset-password': seoTitle += ' | Reset Password'; break
  }
  return seoTitle
}

module.exports = {
  getTitle
}
