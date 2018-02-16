'use strict'

const deps = {
  EnforceACLUseCaseContext: null
}

// Inheritance stinks. Find a way to compose this instead
class ExploreCausesUseCaseContext extends deps.EnforceACLUseCaseContext {
  constructor(req, res) {
    super(req, res)
    this.causes = null
  }
}

module.exports = (EnforceACLUseCaseContext) => {
  deps.EnforceACLUseCaseContext = EnforceACLUseCaseContext
  return ExploreCausesUseCaseContext
}
