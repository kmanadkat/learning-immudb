const jwt = require('jsonwebtoken')
const { configObj } = require('./config')

const payload = { user: { roleCode: 210, id: '123' } }
jwt.sign(payload, configObj.JWT_SECRET, { expiresIn: configObj.JWT_EXPIRY_DAYS }, (err, token) => {
  if (err) {
    throw new Error('Error creating auth token')
  }

  console.log(token)
})
