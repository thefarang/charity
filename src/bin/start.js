'use strict'

const http = require('http')
const config = require('config')
const compose = require('./compose')

const deps = compose()
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
      deps.logService.info({}, bind + ' requires elevated privileges')
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
  deps.logService.info({}, `Listening on ${bind}`)
}

process.on('SIGINT', () => {
  deps.dbService.disconnect()
  deps.searchService.disconnect()
})

// Create an app instance, inject dependencies
const appInstance = app(
  deps.dbService,
  deps.searchService,
  deps.emailService,
  deps.loginAuthRoute, 
  deps.indexRoute)

// Get port from environment and store in Express.
const port = normalizePort(config.get('app.port'))
appInstance.set('port', port)

// Wrap the app in a HTTP server and start the server.
const server = http.createServer(appInstance)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
