const ImmudbClient = require('immudb-node')
const express = require('express')
const router = express.Router()
const { configObj } = require('./config')
const authMiddleware = require('./authMiddleware')

const validateSetReqBody = ({ key, value }) => {
  let errors = []
  if (!key || typeof key !== 'string' || key.length <= 0) {
    errors.push({ msg: 'key is invalid' })
  }
  if (!value || typeof value !== 'string' || value.length <= 0) {
    errors.push({ msg: 'value is invalid' })
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
    console.error('Error from connectUserWithDB: ', error.message)
    return false
  }
}

// Use verifiedGet to Get data
const getVerifiedData = async ({ key }) => {
  try {
    // Verified Get Data
    await cl.verifiedGet({ key })

    // Gracefully logout after work is done
    await cl.logout()
    return true
  } catch (error) {
    console.error('ERROR in verifiedGet: ', error.message)
    return false
  }
}

// Use verifiedSet to Set data for First Time
const setVerifiedData = async ({ key, value }) => {
  try {
    // Verified Set Data
    const verifiedSetDataRes = await cl.verifiedSet({ key, value })

    // Gracefully logout after work is done
    await cl.logout()
    return verifiedSetDataRes
  } catch (error) {
    console.error('ERROR in verifiedSet: ', error.message)
    return false
  }
}

const checkKeyExists = async ({ key }) => {
  try {
    const connectRes = await connectUserWithDB()
    const getDataRes = await getVerifiedData({ key })
    if (!connectRes || !getDataRes) {
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

const setNewData = async ({ key, value }) => {
  try {
    const connectRes = await connectUserWithDB()
    const setDataResp = await setVerifiedData({ key, value })
    if (!connectRes || !setDataResp) {
      return false
    }
    return setDataResp
  } catch (error) {
    console.error('ERROR in mainFunc: ', error.message)
    return false
  }
}

// @route   -  POST /immudb/api/setdata
// @desc    -  Set Key Data
// @access  -  Protected - User
router.post('/', [authMiddleware], async (req, res) => {
  const respObj = { msg: 'Set Key Data', success: false }

  try {
    // Validate Body
    const { key, value } = req.body
    const errors = validateSetReqBody(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ ...respObj, errors })
    }

    // check if data for key already exists
    const keyExists = await checkKeyExists({ key })
    if (keyExists) {
      return res.status(400).json({ ...respObj, errors: [{ msg: `Key Data for ${key} already exists` }] })
    }

    // set the data & return the function return value
    const setNewDataRes = await setNewData({ key, value })
    if (!setNewDataRes) {
      throw new Error(`Error in setting data for ${key}`)
    }
    return res.status(201).json({ ...respObj, success: true, content: setNewDataRes })
  } catch (err) {
    return res.status(500).json({
      ...respObj,
      errors: [{ msg: err.message }],
    })
  }
})

module.exports = router
