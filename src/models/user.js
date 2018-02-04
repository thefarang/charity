'use strict'

class User {
  constructor () {
    this.id = null
    this.email = null
    // Holds a Password object
    this.password = null
    // Holds a Role object
    this.role = null
  }

  // Note that the password is omitted for security purposes.
  toJSON () {
    return {
      id: this.id,
      email: this.email,
      role: this.role
    }
  }
}

module.exports = User
