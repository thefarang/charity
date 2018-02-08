'use strict'

const getAcl = () => {
  return [
    {
      resource: '/',
      permission: 'get',
      roles: ['guest', 'cause', 'donator', 'admin']
    },
    {
      resource: '/explore',
      permission: 'get',
      roles: ['guest', 'cause', 'donator', 'admin']
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
      resource: '/dashboard', // @todo, how about different dashboards? cause-dash, donator-dash, admin-dash?
      permission: 'get',
      roles: ['cause', 'donator', 'admin']
    },
    {
      resource: '/charity-auth',
      permission: 'post',
      roles: ['cause']
    }
  ]
}

module.exports = {
  getAcl
}
