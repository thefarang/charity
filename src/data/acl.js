'use strict'

const ACL = {
  IndexGET: {
    resource: '/',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin'],
    inSitemap: true,
    inRobots: false
  },
  ExploreGET: {
    resource: '/explore',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin'],
    inSitemap: true,
    inRobots: false
  },
  TermsGET: {
    resource: '/terms',
    permission: 'get',
    roles: ['guest', 'cause', 'donator', 'admin'],
    inSitemap: true,
    inRobots: false
  },
  ResetPasswordGET: {
    resource: '/reset-password',
    permission: 'get',
    roles: ['guest'],
    inSitemap: true,
    inRobots: false
  },
  ResetPasswordAuthPOST: {
    resource: '/reset-password-auth',
    permission: 'post',
    roles: ['guest'],
    inSitemap: false,
    inRobots: true
  },
  ResetPasswordConfirm: {
    resource: '/reset-password-confirm',
    permission: 'get',
    roles: ['guest'],
    inSitemap: false,
    inRobots: true
  },
  RegisterGET: {
    resource: '/register',
    permission: 'get',
    roles: ['guest'],
    inSitemap: true,
    inRobots: false
  },
  RegisterAuthPOST: {
    resource: '/register-auth',
    permission: 'post',
    roles: ['guest'],
    inSitemap: false,
    inRobots: true
  },
  RegisterConfirmGET: {
    resource: '/register-confirm',
    permission: 'get',
    roles: ['guest'],
    inSitemap: false,
    inRobots: true
  },
  LoginGET: {
    resource: '/login',
    permission: 'get',
    roles: ['guest'],
    inSitemap: true,
    inRobots: false
  },
  LoginAuthPOST: {
    resource: '/login-auth',
    permission: 'post',
    roles: ['guest'],
    inSitemap: false,
    inRobots: true
  },
  DashboardCharityGET: {
    resource: '/dashboard/cause',
    permission: 'get',
    roles: ['cause'],
    inSitemap: false,
    inRobots: false
  },
  DashboardCharityAuthPOST: {
    resource: '/dashboard/cause-auth',
    permission: 'post',
    roles: ['cause'],
    inSitemap: false,
    inRobots: false
  },
  DashboardAdminGET: {
    resource: '/dashboard/admin',
    permission: 'get',
    roles: ['admin'],
    inSitemap: false,
    inRobots: false
  }
}

module.exports = ACL
