'use strict'

// Describes the relationship between the (DB) UserSchema and 
// the corresponding User model. This is useful for creating
// User model objects from UserSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// UserSchema (mongo) properties on the right
const UserFromDbUserMapping = {
  'id': '_id',
  'state': 'user_state',
  'email': 'user_email',
  'password': true,
  'password.clearPassword': null,
  'password.encryptedPassword': 'user_encrypted_password',
  'role': 'user_role'
}

module.exports = UserFromDbUserMapping
