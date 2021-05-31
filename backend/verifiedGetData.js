const ImmudbClient = require('immudb-node')
const { setupObj } = require('./configVars')

const cl = new ImmudbClient.default({
  host: setupObj.DB_HOST,
  port: setupObj.DB_PORT,
})

// Connect User with DB
const connectUserWithDB = async () => {
  const {DB_NAME, DB_USER, DB_PASSWORD} = setupObj
  try {
    // Login Admin user
    const loginRes = await cl.login({ user: DB_USER, password: DB_PASSWORD })
    console.log(`immuDB user login : ${DB_USER}`, loginRes)

    // Set Active DB
    const dbUseRes = await cl.useDatabase({databasename: DB_NAME})
    console.log(`immuDB DB create : ${DB_NAME}`, dbUseRes)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

// Use verifiedGet to Get data
const getVerifiedData = async ({key}) => {
  try {
    // Verified Get Data
    const verifiedGetDataRes = await cl.verifiedGet({key})
    console.log(`immuDB verified get ${key}`, verifiedGetDataRes)

    // Gracefully logout after work is done
    await cl.logout()
  } catch (error) {
    console.error('ERROR in verifiedGet', error.message)
    process.exit(1)
  }
}

const mainFunc = async() => {
  try {
    await connectUserWithDB()
    await getVerifiedData({key: "student234"})
  } catch (error) {
    console.error('ERROR in mainFunc', error.message)
    process.exit(1)
  }
}

mainFunc()