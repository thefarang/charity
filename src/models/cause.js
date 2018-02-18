'use strict'

class Cause {
  constructor () {
    this.id = null
    this.userId = null
    this.name = null
    this.country = null
  }

  update(cause) {
    this.id = cause.id || this.id
    this.userId = cause.userId || this.userId
    this.name = cause.name || this.name
    this.country = cause.country || this.country
  }

  toJSON () {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      country: this.country
    }
  }
}

module.exports = Cause
