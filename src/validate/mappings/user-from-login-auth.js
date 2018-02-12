'use strict'

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
