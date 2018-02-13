'use strict'

const CauseFromSearchTypeMapping = {
  userId: ['_source', 'userId'],
}

const schema = {
  _source: {
    userId: 'thisistheuser'
  }
}

const value = CauseFromSearchTypeMapping.userId.reduce((prevVal, elem) => {
  console.log(elem)
  console.log(prevVal[elem])
  return prevVal[elem]
}, schema)
console.log(value)

