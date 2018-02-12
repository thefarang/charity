'use strict'

// Note that AWS credentials are automatically retrieved from the environment

// @todo
// Move out of sandbox
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html

const AWS = require('aws-sdk')
const config = require('config')

// @todo configure
// Set the region
AWS.config.update({ region: config.get('email.aws.region') })

// Create sendEmail params 
const params = {
  Destination: {
    CcAddresses: [],
    ToAddresses: [
      'thefarang@protonmail.com'
    ]
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: "<html><body><p>This is a test email</p></body></html>"
      }/*,
      Text: {
       Charset: "UTF-8",
       Data: "TEXT_FORMAT_BODY"
      }*/
    },
    Source: 'thefarang@protonmail.com',
    ReplyToAddresses: [
      'thefarang@protonmail.com'
    ]
  }
}      

// Create the promise and SES service object
const sendPromise = new AWS.SES({ 
  apiVersion: config.get('email.aws.api_version') 
}).sendEmail(params).promise()

// Handle promise's fulfilled/rejected states
sendPromise
  .then((data) => {
    console.log(data.MessageId)
  })
  .catch((err) => {
    console.error(err, err.stack);
  })
