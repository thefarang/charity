'use strict'

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
