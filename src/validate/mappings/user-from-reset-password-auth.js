'use strict'

// Describes the relationship between the (UI) ResetPasswordAuthSchema and 
// it's corresponding User model. This is useful for creating
// User model objects from ResetPasswordAuthSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// ResetPasswordAuthSchema properties on the right
const UserFromResetPasswordAuthMapping = {
  'id': null,
  'state': null,
  'email': 'user_email',
  'password': false,
  'password.clearPassword': null,
  'password.encryptedPassword': null,
  'role': null
}

module.exports = UserFromResetPasswordAuthMapping
