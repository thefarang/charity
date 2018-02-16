'use strict'

const config = require('config')

const compose = () => {
  // LOG DATABASE SEARCH EMAIL
  const dbFactory = require('../services/database/factory')
  const seFactory = require('../services/search/factory')
  const emailFactory = require('../services/email/factory')

  const logService = require('../services/log')
  const dbService = dbFactory(config.get('database.use'))
  const searchService = seFactory(config.get('search.use'))
  const emailService = emailFactory(config.get('email.use'))


  // LOGIN-AUTH DI
  const LoginAuthConstraints = require('../validate/constraints/login-auth')
  const UserFromLoginAuthMapping = require('../validate/mappings/user-from-login-auth')
  const loginAuthUseCaseFactory = require('../use-cases/login-auth')

  const validateUIPolicyFactory = require('../policies/validate-ui')
  const ValidateUIPolicy = validateUIPolicyFactory(logService)

  const loginPolicyFactory = require('../policies/login')
  const UserFactory = require('../factories/user-factory')
  const UserStates = require('../data/user-states')
  const LoginPolicy = loginPolicyFactory(dbService, logService, UserFactory, UserStates)

  const createJWTPolicyFactory = require('../policies/create-jwt')
  const jwtLibrary = require('../lib/jwt')
  const cookiesLibrary = require('../lib/cookies')
  const CreateJWTPolicy = createJWTPolicyFactory(logService, jwtLibrary, cookiesLibrary)

  const LoginAuthUseCase = loginAuthUseCaseFactory(ValidateUIPolicy, LoginPolicy, CreateJWTPolicy)
  const UseCaseContext = require('../context/use-case')

  const loginAuthFactory = require('../routes/login-auth')
  const loginAuthRoute = loginAuthFactory(logService, LoginAuthConstraints, UserFromLoginAuthMapping, LoginAuthUseCase, UseCaseContext)


  // LOGIN DI
  const indexRouteFactory = require('../routes/index')
  const seoLibrary = require('../lib/seo')
  const enforceACLUseCaseFactory = require('../use-cases/enforce-acl')

  const identifyUserPolicyFactory = require('../policies/identify-user')
  const IdentifyUserPolicy = identifyUserPolicyFactory(logService, jwtLibrary, cookiesLibrary, UserFactory)
  const checkRouteAuthorisationPolicyFactory = require('../policies/check-route-auth')
  const aclLibrary = require('../lib/acl')
  const CheckRouteAuthorisationPolicy = checkRouteAuthorisationPolicyFactory(logService, aclLibrary)
  const redirectToAuthRoutePolicyFactory = require('../policies/redirect-to-auth-route')
  const UserRoles = require('../data/user-roles')
  const RedirectToAuthRoutePolicy = redirectToAuthRoutePolicyFactory(UserRoles, logService)
  const EnforceACLUseCase = enforceACLUseCaseFactory(IdentifyUserPolicy, CheckRouteAuthorisationPolicy, RedirectToAuthRoutePolicy)
  const EnforceACLUseCaseContext = require('../context/enforce-acl-use-case')
  const indexRoute = indexRouteFactory(logService, seoLibrary, EnforceACLUseCase, EnforceACLUseCaseContext)

  const exploreCausesPolicyFactory = require('../policies/search-all-causes')
  const ExploreCausesPolicy = exploreCausesPolicyFactory()
  const exploreCausesUseCaseFactory = require('../use-cases/explore-causes')
  const ExploreCausesUseCase = exploreCausesUseCaseFactory(ExploreCausesPolicy, EnforceACLUseCase)

  const exploreCausesUseCaseContextFactory = require('../context/explore-causes-use-case')
  const ExploreCausesUseCaseContext = exploreCausesUseCaseContextFactory(EnforceACLUseCaseContext)

  const exploreRouteFactory = require('../routes/explore')
  const exploreRoute = exploreRouteFactory(logService, seoLibrary, ExploreCausesUseCase, ExploreCausesUseCaseContext)

  return {
    logService,
    dbService,
    searchService,
    emailService,
    loginAuthRoute,
    indexRoute,
    exploreRoute
  }
}


module.exports = compose
