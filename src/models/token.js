'use strict'

class Token {
  constructor () {
    this.userId = null
    this.token = null
  }

  update(token) {
    this.userId = token.userId || this.userId
    this.token = token.token || this.token
  }

  toJSON () {
    return {
      userId: this.userId,
      token: this.token
    }
  }
}

module.exports = Token
