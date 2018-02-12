'use strict'

const ACL = {
  IndexGET: {
    resource: '/',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  ExploreGET: {
    resource: '/explore',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  TermsGET: {
    resource: '/terms',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin']
  },
  ResetPasswordGET: {
    resource: '/reset-password',
    permission: 'get',
    roles: ['guest']
  },
  RegisterGET: {
    resource: '/register',
    permission: 'get',
    roles: ['guest']
  },
  RegisterAuthPOST: {
    resource: '/register-auth',
    permission: 'post',
    roles: ['guest']
  },
  LoginGET: {
    resource: '/login',
    permission: 'get',
    roles: ['guest']
  },
  LoginAuthPOST: {
    resource: '/login-auth',
    permission: 'post',
    roles: ['guest']
  },
  DashboardCharityGET: {
    resource: '/dashboard/cause',
    permission: 'get',
    roles: ['cause']
  },
  DashboardCharityAuthPOST: {
    resource: '/dashboard/cause-auth',
    permission: 'post',
    roles: ['cause']
  },
  DashboardAdminGET: {
    resource: '/dashboard/admin',
    permission: 'get',
    roles: ['admin']
  }
}

/*
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
*/

module.exports = ACL
