'use strict'

class User {
  // Use the factory
  constructor () {
    this.id = null
    this.email = null
    this.password = null
    this.role = null
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
      email: this.email,
      password: null,
      role: null
    }
    if (this.role) {
      json.role = {
        id: this.role.id || null,
        name: this.role.name || null
      }
    }
    return json
  }
}

module.exports = User
