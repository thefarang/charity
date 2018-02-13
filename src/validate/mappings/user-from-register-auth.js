'use strict'

// Describes the relationship between the (UI) RegisterAuthSchema and 
// it's corresponding User model. This is useful for creating
// User model objects from RegisterAuthSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// RegisterAuthSchema properties on the right
const UserFromRegisterAuth = {
  'id': null,
  'state': null,
  'email': 'user_email',
  'password': true,
  'password.clearPassword': 'user_password',
  'password.encryptedPassword': null,
  'role': 'user_role'
}

module.exports = UserFromRegisterAuth
