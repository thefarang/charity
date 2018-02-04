'use strict'

class Role {
  constructor (id, name) {
    this.id = id
    this.name = name
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name
    }
  }
}

module.exports = Role
