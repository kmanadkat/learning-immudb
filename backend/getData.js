const ImmudbClient = require('immudb-node')
const express = require('express')
const router = express.Router()
const { configObj } = require('./config')
const authMiddleware = require('./authMiddleware')

const validateGetReqBody = ({ key }) => {
  let errors = []
  if (!key || typeof key !== 'string' || key.length <= 0) {
    errors.push({ msg: 'key is invalid' })
  }
  return errors
}

const cl = new ImmudbClient.default({
  host: configObj.DB_HOST,
  port: configObj.DB_PORT,
})

// Connect User with DB
const connectUserWithDB = async () => {
  const { DB_NAME, DB_USER, DB_PASSWORD } = configObj
  try {
    // Login Admin user
    await cl.login({ user: DB_USER, password: DB_PASSWORD })

    // Set Active DB
    await cl.useDatabase({ databasename: DB_NAME })
    return true
  } catch (error) {
    console.error(error.message)
    return false
  }
}

// Use verifiedGet to Get data
const getVerifiedData = async ({ key }) => {
  try {
    // Verified Get Data
    const getDataRes = await cl.verifiedGet({ key })

    // Gracefully logout after work is done
    await cl.logout()
    return getDataRes
  } catch (error) {
    console.error('ERROR in verifiedGet', error.message)
    return false
  }
}

const getUserDataIfExists = async ({ key }) => {
  try {
    const connectRes = await connectUserWithDB()
    const getDataRes = await getVerifiedData({ key })
    if (!connectRes || !getDataRes) {
      return false
    }
    return getDataRes
  } catch (error) {
    return false
  }
}

// @route   -  POST /immudb/api/getdata
// @desc    -  Get Key Data
// @access  -  Protected - User
router.post('/', [authMiddleware], async (req, res) => {
  const respObj = { msg: 'Get Employee Data', success: false }

  try {
    // Validate Body
    const { key } = req.body
    const errors = validateGetReqBody(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ ...respObj, errors })
    }

    // check if data for key already exists
    const userData = await getUserDataIfExists({ key })
    if (!userData) {
      return res.status(400).json({ ...respObj, errors: [{ msg: `Data for ${key} doesnot exists` }] })
    }

    return res.status(200).json({ ...respObj, success: true, content: userData })
  } catch (err) {
    return res.status(500).json({
      ...respObj,
      errors: [{ msg: err.message }],
    })
  }
})

module.exports = router
