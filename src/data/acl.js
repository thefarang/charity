'use strict'

const getAclSchema = () => {
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
      resource: '/faq',
      permission: 'get',
      roles: ['guest', 'cause', 'donator', 'admin']
    },
    {
      resource: '/terms',
      permission: 'get',
      roles: ['guest', 'cause', 'donator', 'admin']
    },
    {
      resource: '/reset-password',
      permission: 'get',
      roles: ['guest']
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
      resource: '/dashboard/charity',
      permission: 'get',
      roles: ['cause']
    },
    {
      resource: '/dashboard/admin',
      permission: 'get',
      roles: ['admin']
    },
    {
      resource: '/dashboard/charity-auth',
      permission: 'post',
      roles: ['cause']
    }
  ]
}

module.exports = {
  getAclSchema
}
