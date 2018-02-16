'use strict'

const Action = require('oja').Action

const deps = {
  logService: null,
  searchService: null
}

class SearchAllCausesPolicy extends Action {
  async execute () {
    const context = await this.consume('context')
    context.causes = await deps.searchService.search()
    deps.logService.info({ noOfCausesFound: causes.length }, 'Causes found in default search')
    this.define('cause-search-complete', context)
  }
}

module.exports = (logService, searchService) => {
  deps.logService = logService
  deps.searchService = searchService
  return SearchAllCausesPolicy
}
