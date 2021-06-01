const ImmudbClient = require('immudb-node')
const { configObj } = require('./config')

const cl = new ImmudbClient.default({
  host: configObj.DB_HOST,
  port: configObj.DB_PORT,
})

const checkIfElementExists = (list = [], prop, element) => {
  const elementIndex = list.findIndex((e) => e[prop] === element)
  return elementIndex === -1 ? false : true
}

const initializeDBUser = async () => {
  const { AD_USER, AD_PASSWORD, DB_NAME, DB_USER, DB_PASSWORD } = configObj

  try {
    // Login Admin User
    await cl.login({ user: AD_USER, password: AD_PASSWORD })

    // Create DB if doesnot exists
    const dbList = await cl.listDatabases()
    const isDBExists = checkIfElementExists(dbList.databasesList, 'databasename', DB_NAME)
    if (!isDBExists) {
      await cl.createDatabase({ databasename: DB_NAME })
    }

    // Create User if doesnot exists
    const userList = await cl.listUsers()
    const isUserExists = checkIfElementExists(userList.usersList, 'user', DB_USER)
    if (!isUserExists) {
      await cl.createUser({
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        permission: 2,
      })
    }

    // Set Default Database to DB_NAME
    await cl.useDatabase({ databasename: DB_NAME })

    // Gracefully Logout
    await cl.logout()
  } catch (err) {
    console.log('ERROR in initializeDBUser: ', err)
  }
}

module.exports = initializeDBUser
