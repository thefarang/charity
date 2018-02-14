'use strict'

const UserFactory = require('../factories/user-factory')
const UserRoles = require('../data/user-roles')
const libTokens = require('../lib/tokens')
const libCookies = require('../lib/cookies')
const servLog = require('../services/log')

const handleIdentifyUser = async (req, res, next) => {
  // Set the user as guest by default
  res.locals.user = UserFactory.createGuestUser()
  let token = null
  try {
    token = libTokens.getToken(req)
    if (token) {
      servLog.info({ token: token }, 'Token found')
      const userFromToken = await libTokens.getUserByToken(token)
      if (userFromToken) {
        res.locals.user = userFromToken
      } else {
        servLog.info({ token: token }, 'Token has expired.')
        libCookies.unsetCookie(res)
      }
    }

    // Delegate to the route handlers below
    return next()
  } catch (err) {
    servLog.info({ err: err, token: token }, 'An error ocurred whilst parsing json webtoken')
    return next(err)
  }
}

const handleCheckRouteAuthorisation = async (req, res, next) => {
  // Prevent authorisation check on a non-existant resource
  if (!libAcl.isResourceExistant(req.path)) {
    return next()
  }

  // Handle 401 Unauthorized through 302 Redirect. Not semantically correct but supports the
  // end user well-enough and minimises work here.
  if (libAcl.isUserAuthorised(req.path, req.method.toLowerCase(), res.locals.user.role)) {
    // Delegate to the route handlers
    return next()
  }

  servLog.info({
    user: res.locals.user.toJSONWithoutPassword(),
    resource: req.path
  }, 'User attempted to access unauthorised route. Redirecting.')

  if (res.locals.user.role === UserRoles.GUEST) {
    res.redirect(302, '/login')
  } else {
    // Route to the correct dashboard
    const route = res.locals.user.role === UserRoles.ADMIN ? UserRoles.ADMIN : UserRoles.CAUSE
    res.redirect(302, `/dashboard/${route}`)
  }
}

const handleResourceNotFound = (req, res, next) => {
  servLog.info({ path: req.path }, 'An unknown route has been requested')
  res.render('404', {
    seo: libSeo('/404'),
    route: '/404',
    user: res.locals.user,
    message: `This page isn't available`
  })
}

const handleApplicationError = (err, req, res, next) => {
  servLog.info({ err: err }, 'Error handled finally by the error display middleware')
  res.status(500)
  res.render('500', {
    seo: libSeo('/error'),
    route: '/error',
    user: res.locals.user || null,
    message: `Something went wrong, sorry. Please wait a few moments then refresh this page`
  })
}

module.exports = {
  handleIdentifyUser,
  handleCheckRouteAuthorisation,
  handleResourceNotFound,
  handleApplicationError
}
