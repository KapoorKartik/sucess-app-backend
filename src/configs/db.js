const { MongoClient } = require("mongodb");

let dbClient;

async function connectToDB() {
  const uri = "mongodb://localhost:27017";
  dbClient = new MongoClient(uri);
  await dbClient.connect();
  return dbClient.db("sucess-app");
}

async function closeDBConnection() {
  if (dbClient) {
    await dbClient.close();
  }
}

// const isConnected = () =>{
//      return dbClient && dbClient.topology && dbClient.topology.isConnected();

// }

module.exports = { connectToDB, closeDBConnection };


