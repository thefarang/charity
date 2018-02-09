'use strict'

const config = require('config')

const getTitle = (title) => {
  let seoTitle = `${config.get('app.brand')}`
  switch (title) {
    case 'index': seoTitle += ' | Home'; break
    case 'explore': seoTitle += ' | Explore Charities'; break
    case 'faq': seoTitle += ' | Frequently Asked Questions'; break
    case 'login': seoTitle += ' | Login'; break
    case 'register': seoTitle += ' | Register'; break
    case 'dashboard/charity':
    case 'dashboard/admin':
      seoTitle += ' | Dashboard'
      break
  }
  return seoTitle
}

module.exports = {
  getTitle
}
