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

// Use verifiedSet to Set data for First Time
const setVerifiedData = async ({key, value}) => {
  try {
    // Verified Set Data
    const verifiedSetDataRes = await cl.verifiedSet({key, value})
    console.log(`immuDB verified set ${key}: ${value}`, verifiedSetDataRes)

    // Gracefully logout after work is done
    await cl.logout()
  } catch (error) {
    console.error('ERROR in verifiedSet', error.message)
    process.exit(1)
  }
}

const mainFunc = async() => {
  try {
    await connectUserWithDB()
    await setVerifiedData({key: "student234", value: "James"})
  } catch (error) {
    console.error('ERROR in mainFunc', error.message)
    process.exit(1)
  }
}

mainFunc()