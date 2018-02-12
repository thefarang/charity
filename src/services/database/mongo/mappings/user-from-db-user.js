'use strict'

const UserFromDbUserMapping = {
  'id': '_id',
  'email': 'user_email',
  'password': true,
  'password.clearPassword': null,
  'password.encryptedPassword': 'user_encrypted_password',
  'role': true,
  'role.id': 'user_role_id',
  'role.name': 'user_role_name'
}

module.exports = UserFromDbUserMapping
