const express = require('express')
const cors = require('cors')
const { configObj } = require('./config')
const initializeDBUser = require('./init')
const app = express()

// Body Parser & Cors
app.use(express.json({ extended: false }))
app.use(cors())

// Initialize Blockchain DB & DB USER
initializeDBUser()

// API Test Route
app.get('/immudb', (req, res, next) => res.send('immudb API running'))

// Register Routers
app.use('/immudb/api/getdata', require('./getData'))
app.use('/immudb/api/setdata', require('./setData'))

const PORT = configObj.SERVER_PORT
app.listen(PORT, () => {
  console.log(`immudb API running on PORT ${PORT}`)
})
