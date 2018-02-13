'use strict'

// Describes the relationship between the (UI) CauseAuthSchema and 
// it's corresponding Cause model. This is useful for creating
// Cause model objects from CauseAuthSchema objects, as both
// can be passed to the CauseFactory which will do the rest.

// Cause (model) properties on the left
// CauseAuthSchema properties on the right
const CauseFromCauseAuthMapping = {
  'id': null,
  'userId': null,
  'name': 'cause_name',
  'country': 'cause_country'
}

module.exports = CauseFromCauseAuthMapping
