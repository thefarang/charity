'use strict'

const Action = require('oja').Action

const deps = {
  ExploreCausesPolicy: null,
  EnforceACLUseCase: null
}

// Remove this inheritance
class ExploreCausesUseCase extends deps.EnforceACLUseCase  {
  constructor() {
    super()
    this.add(
      new deps.ExploreCausesPolicy())
  }
}

module.exports = (ExploreCausesPolicy, EnforceACLUseCase) => {
  deps.EnforceACLUseCase = EnforceACLUseCase
  deps.ExploreCausesPolicy = ExploreCausesPolicy
  return ExploreCausesUseCase
}
