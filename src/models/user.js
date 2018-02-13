'use strict'

class User {
  // Use the factory
  constructor () {
    this.id = null
    this.state = null
    this.email = null
    this.password = null
    this.role = null
  }

  update(user) {
    this.id = user.id || this.id
    this.state = user.state || this.state
    this.email = user.email || this.email
    if (user.password) {
      if (!this.password) {
        this.password = user.password
      } else {
        this.password.clearPassword = user.password.clearPassword || this.password.clearPassword
        this.password.encryptedPassword = user.password.encryptedPassword || this.password.encryptedPassword
      }
    }
    this.role = user.role || this.role
  }

  toJSONWithPassword () {
    const json = this.toJSONWithoutPassword()
    if (this.password) {
      json.password = {
        clearPassword: this.password.clearPassword || null,
        encryptedPassword: this.password.encryptedPassword || null
      }
    }
    return json
  }

  toJSONWithoutPassword () {
    const json = {
      id: this.id,
      state: this.state,
      email: this.email,
      password: null,
      role: this.role
    }
    return json
  }
}

module.exports = User
