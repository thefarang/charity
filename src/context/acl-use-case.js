'use strict'

class IndexUseCaseContext  {
  constructor(req, res) {
    // Express request/response objects
    this.req = res
    this.res = res
    this.user = null
    this.status = null
    this.action = null
    this.data = null
  }
}

module.exports = IndexUseCaseContext
