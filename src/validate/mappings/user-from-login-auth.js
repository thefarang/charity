'use strict'

const UserFromLoginAuthMapping = {
  'id': null,
  'email': 'user_email',
  'password': true,
  'password.clearPassword': 'user_password',
  'password.encryptedPassword': null,
  'role': false,
  'role.id': null,
  'role.name': null
}

module.exports = UserFromLoginAuthMapping
