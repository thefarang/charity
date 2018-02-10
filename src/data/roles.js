'use strict'

const getRegisterableRoleSchemas = () => {
  return [
    {
      user_role_id: 2,
      user_role_name: 'cause'
    },
    {
      user_role_id: 3,
      user_role_name: 'donator'
    }
  ]
}

const getAllRoleSchemas = () => {
  return [
    {
      user_role_id: 1,
      user_role_name: 'guest'
    },
    {
      user_role_id: 2,
      user_role_name: 'cause'
    },
    {
      user_role_id: 3,
      user_role_name: 'donator'
    },
    {
      user_role_id: 4,
      user_role_name: 'admin'
    }
  ]
}

module.exports = {
  getRegisterableRoleSchemas,
  getAllRoleSchemas
}
