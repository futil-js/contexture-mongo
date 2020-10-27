let { MongoClient } = require('mongodb')
let { MongoMemoryServer } = require('mongodb-memory-server')

let getMongoClient = async mongoUri =>
  MongoClient.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

let setUpClientConnection = async () => {
  let mongoServer = new MongoMemoryServer()
  let mongoUri = await mongoServer.getConnectionString()
  let connection = await getMongoClient(mongoUri)
  let dbName = await mongoServer.getDbName()

  return connection.db(dbName)
}

module.exports = {
  getMongoClient,
  setUpClientConnection,
}
