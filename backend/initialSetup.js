const ImmudbClient = require('immudb-node')
const { setupObj } = require('./configVars')

const cl = new ImmudbClient.default({
  host: setupObj.DB_HOST,
  port: setupObj.DB_PORT,
})

// Connect and create DB & User
const connectInitialize = async () => {
  const {AD_USER, AD_PASSWORD, DB_NAME, DB_USER, DB_PASSWORD} = setupObj
  try {
    // Login Admin user
    const loginRes = await cl.login({ user: AD_USER, password: AD_PASSWORD })
    console.log(`immuDB user login : ${AD_USER}`, loginRes)

    // Create DB
    const dbCreateRes = await cl.createDatabase({databasename: DB_NAME})
    console.log(`immuDB DB create : ${DB_NAME}`, dbCreateRes)

    // Create DB user
    const dbUserCreate = await cl.createUser({
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      permission: 2
    })
    console.log(`immuDB User create : ${DB_USER}`, dbUserCreate)

    // Gracefully logout after work is done
    await cl.logout()

  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

connectInitialize()