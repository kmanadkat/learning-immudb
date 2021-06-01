const jwt = require('jsonwebtoken')
const { configObj } = require('./config')

module.exports = async (req, res, next) => {
  const respObj = { msg: 'Authentication request', success: false }

  // Get token from header
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({
      ...respObj,
      errors: [{ msg: 'Authentication token not found' }],
    })
  }

  try {
    const decoded = jwt.verify(token, configObj.JWT_SECRET)
    const { roleCode } = decoded.user

    // Validate role code
    if (roleCode !== 210) {
      throw new Error('Authentication token invalid')
    }
    next()
  } catch (err) {
    return res.status(401).json({
      ...respObj,
      errors: [{ msg: 'Authentication token invalid' }],
    })
  }
}
