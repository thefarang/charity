'use strict'

const bools = ["true", "false"]

// @todo
// Inherit
const constraints = {
  charity_id: {
    presence: true,
    format: {
      pattern: "[\-a-zA-Z0-9]+",
      flags: "i",
      message: "^Invalid charity ID"
    },
  },
  is_visible: {
    inclusion: {
      within: bools,
      message: "^Invalid charity visibility"
    }
  },
  name: {
    format: {
      pattern: "[\. a-zA-Z0-9-]*",
      flags: "i",
      message: "^The charity name contains invalid characters"
    },
    length: {
      maximum: 50,
      message: "^We can only store a charity name that is less than 50 characters long"
    }
  },
  country: {
    format: {
      pattern: "[a-zA-Z]*",
      flags: "i",
      message: "^The country name contains invalid characters"
    },
    length: {
      maximum: 100,
      message: "^The country name should be less than 100 characters long"
    }
  },
  is_registered: {
    inclusion: {
      within: bools,
      message: "^Invalid charity registration indicator"
    }
  },
  /*
  // @todo - these validators dont work on empty strings
  // Change the client post to ensure empty values are not sent for these two
  website: {
    url: {
      message: "^Invalid website url"
    },
    length: {
      maximum: 100,
      message: "^The website name should be less than 100 characters"
    }
  },
  email: {
    email: {
      message: "^The email address is invalid"
    },
    length: {
      maximum: 50,
      message: "^The email address should be less than 50 characters"
    }
  },
  */
  phone: {
    format: {
      pattern: "[ \-\(\)\+a-zA-Z0-9]*",
      flags: "i",
      message: "^The phone number contains invalid characters"
    },
    length: {
      maximum: 25,
      message: "^The phone number should be less than 25 characters"
    }
  },
  short_desc: {
    format: {
      pattern: "[ \\.(\)\+\-a-zA-Z0-9]*",
      flags: "i",
      message: "^The short description contains invalid characters"
    },
    length: {
      maximum: 80,
      message: "^The short description should be less than 80 characters"
    }
  },
  long_desc: {
    presence: false,
    format: {
      pattern: "[ \\.(\)\+\-a-zA-Z0-9]*",
      flags: "i",
      message: "^The long description contains invalid characters"
    },
    length: {
      maximum: 500,
      message: "^The long description should be less than 500 characters"
    }
  },
  keyword_1: {
    presence: false,
    format: {
      pattern: "[a-zA-Z0-9\ ]*",
      flags: "i",
      message: "^Keyword 1 contains invalid characters"
    },
  },
  keyword_2: {
    presence: false,
    format: {
      pattern: "[a-zA-Z0-9\ ]*",
      flags: "i",
      message: "^Keyword 2 contains invalid characters"
    },
  }

}

module.exports = constraints
