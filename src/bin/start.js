'use strict'

const http = require('http')
const config = require('config')
const servLog = require('../services/log')
const dbFactory = require('../services/database/factory')
const seFactory = require('../services/search/factory')
const emailFactory = require('../services/email/factory')
const app = require('../app')

// Normalize a port into a number, string, or false.
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

// Event listener for HTTP server "error" event.
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      servLog.info({}, bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      servLog.info({}, bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  servLog.info({}, `Listening on ${bind}`)
}


// @todo - This is the composition route. Extract to own file.
// Connect to the persistance layers
const db = dbFactory(config.get('database.use'))
const se = seFactory(config.get('search.use'))
process.on('SIGINT', () => {
  db.disconnect()
  se.disconnect()
})


// LOGIN-AUTH DI
const LoginAuthConstraints = require('../validate/constraints/login-auth')
const UserFromLoginAuthMapping = require('../validate/mappings/user-from-login-auth')
const loginAuthUseCaseFactory = require('../use-cases/login-auth')

const validateUIPolicyFactory = require('../policies/validate-ui')
const ValidateUIPolicy = validateUIPolicyFactory(servLog)

const loginPolicyFactory = require('../policies/login')
const UserFactory = require('../factories/user-factory')
const UserStates = require('../data/user-states')
const LoginPolicy = loginPolicyFactory(db, servLog, UserFactory, UserStates)

const createJWTPolicyFactory = require('../policies/create-jwt')
const jwtLibrary = require('../lib/jwt')
const cookiesLibrary = require('../lib/cookies')
const CreateJWTPolicy = createJWTPolicyFactory(servLog, jwtLibrary, cookiesLibrary)

const LoginAuthUseCase = loginAuthUseCaseFactory(ValidateUIPolicy, LoginPolicy, CreateJWTPolicy)
const UseCaseContext = require('../context/use-case')

const loginAuthFactory = require('../routes/login-auth')
const loginAuthRoute = loginAuthFactory(servLog, LoginAuthConstraints, UserFromLoginAuthMapping, LoginAuthUseCase, UseCaseContext)


// LOGIN DI
const indexRouteFactory = require('../routes/index')
const seoLibrary = require('../lib/seo')
const enforceACLUseCaseFactory = require('../use-cases/enforce-acl')

const identifyUserPolicyFactory = require('../policies/identify-user')
const IdentifyUserPolicy = identifyUserPolicyFactory(servLog, jwtLibrary, cookiesLibrary, UserFactory)
const checkRouteAuthorisationPolicyFactory = require('../policies/check-route-auth')
const aclLibrary = require('../lib/acl')
const CheckRouteAuthorisationPolicy = checkRouteAuthorisationPolicyFactory(servLog, aclLibrary)
const redirectToAuthRoutePolicyFactory = require('../policies/redirect-to-auth-route')
const UserRoles = require('../data/user-roles')
const RedirectToAuthRoutePolicy = redirectToAuthRoutePolicyFactory(UserRoles)
const EnforceACLUseCase = enforceACLUseCaseFactory(IdentifyUserPolicy, CheckRouteAuthorisationPolicy, RedirectToAuthRoutePolicy)
const ACLUseCaseContext = require('../context/acl-use-case')
const indexRoute = indexRouteFactory(servLog, seoLibrary, EnforceACLUseCase, ACLUseCaseContext)


// Create an app instance, inject dependencies
const mp = emailFactory(config.get('email.use'))
const appInstance = app(db, se, mp, loginAuthRoute, indexRoute)

// Get port from environment and store in Express.
const port = normalizePort(config.get('app.port'))
appInstance.set('port', port)

// Wrap the app in a HTTP server and start the server.
const server = http.createServer(appInstance)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
