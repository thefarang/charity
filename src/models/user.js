'use strict'

const RoleFactory = require('./role-factory')
const PasswordFactory = require('./password-factory')

class User {
  // Use the factory
  constructor (schema) {
    this.id = null
    this.email = null
    this.password = null
    this.role = null
    this.update(schema)
  }

  // Apply the updateSchema values to the User, whilst persisting any
  // unchanged User values.
  update(updateSchema) {
    this.id = updateSchema.user_id || null
    this.email = updateSchema.user_email || null

    if ((updateSchema.user_password) || (updateSchema.user_encrypted_password)) {
      if (!this.password) {
        this.password = PasswordFactory.createFromSchema(updateSchema)
      } else {
        if (updateSchema.user_password) {
          this.password.clearPassword = updateSchema.user_password
        }
        if (updateSchema.user_encrypted_password) {
          this.password.encryptedPassword = updateSchema.user_encrypted_password
        }
      }
    }

    if (updateSchema.user_role_id || updateSchema.user_role_name) {
      if (!this.role) {
        this.role = RoleFactory.createFromSchema(updateSchema)
      } else {
        if (updateSchema.user_role_id) {
          this.role.id = updateSchema.user_role_id
        }
        if (updateSchema.user_role_name) {
          this.role.name = updateSchema.user_role_name
        }
      }
    }
  }

  toFullSchema () {
    const schema = this.toSecureSchema()
    if (this.password) {
      schema.user_password = this.password.clearPassword || null
      schema.user_encrypted_password = this.password.encryptedPassword || null
    }
    return schema
  }

  toSecureSchema () {
    const schema = {
      user_id: this.id,
      user_email: this.email,
      user_password: null,
      user_encrypted_password: null,
      user_role_id: null,
      user_role_name: null
    }
    if (this.role) {
      schema.user_role_id = this.role.id || null
      schema.user_role_name = this.role.name || null
    }
    return schema
  }
}

module.exports = User
