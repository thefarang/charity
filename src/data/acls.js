'use strict'

const getAcls = () => {
  return [
    {
      resource: '/',
      permission: 'get',
      roles: ['guest', 'charity', 'donator', 'admin']
    },
    {
      resource: '/register',
      permission: 'get',
      roles: ['guest']
    },
    {
      resource: '/register-auth',
      permission: 'post',
      roles: ['guest']
    },
    {
      resource: '/login',
      permission: 'get',
      roles: ['guest']
    },
    {
      resource: '/login-auth',
      permission: 'post',
      roles: ['guest']
    },
    {
      resource: '/dashboard', // @todo, how about charity-dash, donator-dash, admin-dash?
      permission: 'get',
      roles: ['guest', 'charity', 'donator', 'admin']
    }
  ]
}

module.exports = {
  getAcls
}
