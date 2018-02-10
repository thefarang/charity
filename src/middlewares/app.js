'use strict'

const handleIdentifyUser = async (req, res, next) => {
  const libTokens = req.app.get('libTokens')
  const libCookies = req.app.get('libCookies')
  const servLog = req.app.get('servLog')
  const dataUsers = req.app.get('dataUsers')

  // Set the user as guest by default
  res.locals.user = dataUsers.getGuestUser()
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
  const libAcl = req.app.get('libAcl')
  const servLog = req.app.get('servLog')

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
    user: res.locals.user.toJSON(),
    resource: req.path
  }, 'User attempted to access unauthorised route. Redirecting.')

  if (res.locals.user.role.name === 'guest') {
    res.redirect(302, '/login')
  } else {
    // Route to the correct dashboard
    const route = res.locals.user.role.name === 'admin' ? 'admin' : 'charity'
    res.redirect(302, `/dashboard/${route}`)
  }
}

const handleResourceNotFound = (req, res, next) => {
  const servLog = req.app.get('servLog')
  const libSeo = req.app.get('libSeo')

  servLog.info({ path: req.path }, 'An unknown route has been requested')
  res.render('404', {
    seo: libSeo('/404'),
    route: '/404',
    user: res.locals.user,
    message: `This page isn't available`
  })
}

const handleApplicationError = (err, req, res, next) => {
  const servLog = req.app.get('servLog')
  const libSeo = req.app.get('libSeo')
  
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
