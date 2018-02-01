'use strict'

// Require and configure dotenv immediately, to pull secure environment variables
// from the .env file into process.env
require('dotenv').config()

const http = require('http')

const log = require('../services/log')
const dbFacade = require('../services/database/facade')
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
      log.info({}, bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      log.info({}, bind + ' is already in use')
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
  log.info({}, `Listening on ${bind}`)
}

// Start the database
dbFacade.connect()
process.on('SIGINT', () => dbFacade.disconnect())

// Create an app instance, injecting dependencies accordingly.
const appInstance = app(dbFacade)

// Get port from environment and store in Express.
// @todo How does docker indicate to the app which port to use?
const port = normalizePort(process.env.PORT || '80')
appInstance.set('port', port)

// Wrap the app in a HTTP server and start the server.
const server = http.createServer(appInstance)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
