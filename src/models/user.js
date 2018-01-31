'use strict'

class User {
  constructor(id, email, password, role) {
    this.id = id
    this.email = email
    this.password = password
    this.role = role
  }

  // Note that the password is omitted for security purposes.
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role
    }
  }
}

module.exports = User
