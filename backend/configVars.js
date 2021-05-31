const setupObj = {
  DB_HOST: "127.0.0.1",           // I wanted it make it localhost, not allowing outisde connections
  DB_PORT: "8001",                // Port where immudb service is running
  DB_NAME: "blockchain",          // name of new immudb DB
  AD_USER: "immudb",              // default immudb user
  AD_PASSWORD: "admin",           // Same as immudb.toml conf file
  DB_USER: "blockchain",          // DB specific user
  DB_PASSWORD: "Blockchain@2021"  // DB specific password
}

module.exports = {setupObj}