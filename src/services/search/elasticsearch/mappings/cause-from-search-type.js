'use strict'

// Describes the relationship between the Search schema and 
// the corresponding Cause model. This is useful for creating
// Cause model objects from Search schema objects, as both
// can be passed to the CauseFactory which will do the rest.

// Cause (model) properties on the left
// Search schema properties on the right
const CauseFromSearchTypeMapping = {
  'id': '_id',
  'userId': '_source.userId',
  'name': '_source.name',
  'country': '_source.country'
}

module.exports = CauseFromSearchTypeMapping
