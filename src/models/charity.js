'use strict'

class Charity {
  constructor () {
    this.id = null
    this.userId = null
    this.isVisible = false

    // @todo not yet implemented
    // this.detailsStatus = false
    
    this.name = null
    this.country = null
    this.isRegistered = false
    this.website = null
    this.email = null
    this.phone = null
    this.shortDesc = null
    this.longDesc = null
    this.imageThumb = null
    this.imageFull = null
    this.keywords = []
  }

  setIsVisible (isVisible) {
    // Check for null, undefined and false
    if ((!isVisible) || (isVisible === false)) {
      this.isVisible = false
      return
    }

    // Check for false indicators in a string, e.g. "false" and "FALSE"
    if ((typeof isVisible === 'string') && (isVisible.toLowerCase() === 'false')) {
      this.isVisible = false
      return
    }

    this.isVisible = true
  }

  setIsRegistered (isRegistered) {
    // Check for null, undefined and false
    if ((!isRegistered) || (isRegistered === false)) {
      this.isRegistered = false
      return
    }

    // Check for false indicators in a string, e.g. "false" and "FALSE"
    if ((typeof isRegistered === 'string') && (isRegistered.toLowerCase() === 'false')) {
      this.isRegistered = false
      return
    }

    this.isRegistered = true
  }

  toJSON () {
    return {
      id: this.id,
      userId: this.userId,
      isVisible: this.isVisible,
      // detailsStatus: this.detailsStatus, // @todo not yet implemented
      name: this.name,
      isRegistered: this.isRegistered,
      country: this.country,
      website: this.website,
      email: this.email,
      phone: this.phone,
      shortDesc: this.shortDesc,
      longDesc: this.longDesc,
      imageThumb: this.imageThumb,
      imageFull: this.imageFull,
      keywords: this.keywords
    }
  }
}

module.exports = Charity
