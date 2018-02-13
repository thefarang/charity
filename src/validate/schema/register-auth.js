'use strict'

// Describes the shape of the UI schema and it's corresponding
// constraints
const RegisterAuthSchema = {
  first_name: 'first_name',
  last_name: 'last_name',
  user_email: 'user_email',
  confirm_user_email: 'confirm_user_email',
  user_password: 'user_password',
  confirm_user_password: 'confirm_user_password',
  user_role: 'user_role'
}

module.exports = RegisterAuthSchema
