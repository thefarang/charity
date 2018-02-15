'use strict'

const Action = require('oja').Action

const deps = {
  dbService: null,
  logService: null,
  UserFactory: null,
  UserStates: null
}

class LoginPolicy extends Action {
  
  // Find user
  // Test user state is confirmed
  // Test password correct
  async execute () {
    // Begin processing when we receive valid user credentials.
    const context = await this.consume('valid-credentials')

    // Attempt to find the same user in the dbase
    const user = await deps.dbService.getUserActions().findUser(deps.UserFactory.createUser(context.schema, context.schematoUserMapping))
    if (!user) {
      deps.logService.info({ email: context.schema.user_email }, 'User does not exist in the database')
      context.status = 400
      context.message = 'User does not exist in the database'
      this.define('user-not-found', context)
      return
    }

    deps.logService.info({ user: user.toJSONWithoutPassword() }, 'User found in database')

    // Ensure the user has a UserStates.CONFIRMED status
    if (user.state !== deps.UserStates.CONFIRMED) {
      deps.logService.info({ 
        user: user.toJSONWithoutPassword() }, 
        'User does not have a CONFIRMED status')
      
      context.status = 401
      context.message = 'You need to confirm your email address'
      this.define('user-not-confirmed', context)
      return
    }

    deps.logService.info({ user: user.toJSONWithoutPassword() }, 'User is already confirmed')

    // Test the password is correct
    const isPasswordCorrect =
      await user.password.isClearPasswordCorrect(
        user.password.clearPassword, user.password.encryptedPassword)

    if (!isPasswordCorrect) {
      deps.logService.info({ user: user.toJSONWithoutPassword() }, 'User password is incorrect')
      context.status = 401
      context.message = 'The password is incorrect'
      this.define('user-password-incorrect', context)
      return
    }

    deps.logService.info({ user: user.toJSONWithoutPassword() }, 'User successfully authenticated')
    context.user = user
    this.define('user-authentication-success', context)
  }
}

module.exports = (dbService, logService, UserFactory, UserStates) => {
  deps.dbService = dbService
  deps.logService = logService
  deps.UserFactory = UserFactory
  deps.UserStates = UserStates
  return LoginPolicy
}
