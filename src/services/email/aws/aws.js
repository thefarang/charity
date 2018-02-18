'use strict'

// @todo Move out of sandbox
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html

// Note that AWS credentials are automatically retrieved from the environment
const AWS = require('aws-sdk')
const config = require('config')

const init = () => {
  AWS.config.update({ region: config.get('email.aws.region') })
}

// @todo use templates/register-confirm
const sendRegisterConfirm = (token) => {
  const params = {
    Destination: {
      ToAddresses: [
        'success@simulator.amazonses.com'
      ],
    },
    Source: 'thefarang@protonmail.com',
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Registration Email'
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html><body><p>This is a test email:${token}</p></body></html>`
        }
      }
    }
  }
  return sendMail(params)
}

const sendResetPassword = (token) => {
  const params = {
    Destination: {
      ToAddresses: [
        'success@simulator.amazonses.com'
      ],
    },
    Source: 'thefarang@protonmail.com',
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Password Reset Email'
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html><body><p>This is a RESET email:${token}</p></body></html>`
        }
      }
    }
  }
  return sendMail(params)
}

const sendMail = async (params) => {
  try {
    return new AWS.SES({
      apiVersion: config.get('email.aws.api_version')
    })
    .sendEmail(params)
    .promise()
    .then((data) => {
      console.log(data.MessageId)
    })
    .catch((err) => {
      console.error(err, err.stack)
    })
  } catch (err) {
    console.log('BIG ERR')
    console.log(err)
  }
  return null
}

module.exports = () => {
  init()
  return {
    sendRegisterConfirm: sendRegisterConfirm,
    sendResetPassword: sendResetPassword
  }
}