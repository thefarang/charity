'use strict'

// Describes the relationship between the (UI) LoginAuthSchema and 
// it's corresponding User model. This is useful for creating
// User model objects from LoginAuthSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// LoginAuthSchema properties on the right
const UserFromLoginAuthMapping = {
  'id': null,
  'state': null,
  'email': 'user_email',
  'password': true,
  'password.clearPassword': 'user_password',
  'password.encryptedPassword': null,
  'role': null
}

module.exports = UserFromLoginAuthMapping
