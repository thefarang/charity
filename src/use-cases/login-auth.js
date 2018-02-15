'use strict'

const Action = require('oja').Action

const deps = {
  ValidateUIPolicy: null,
  LoginPolicy: null,
  CreateJWTPolicy: null
}

class LoginAuthUseCase extends Action  {
  constructor() {
    super()
    this.add(
      new deps.ValidateUIPolicy(),
      new deps.LoginPolicy(),
      new deps.CreateJWTPolicy())
  }
}

module.exports = (ValidateUIPolicy, LoginPolicy, CreateJWTPolicy) => {
  deps.ValidateUIPolicy = ValidateUIPolicy
  deps.LoginPolicy = LoginPolicy
  deps.CreateJWTPolicy = CreateJWTPolicy
  return LoginAuthUseCase
}
