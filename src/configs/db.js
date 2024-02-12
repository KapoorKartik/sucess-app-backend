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


/* *
  *first listing page where every test shows
  *second on mock test page of specific test 
  *third on question page
  *forth on question submit that save the response of student and send the master result data on front page where result is calculated and saved on backend and updated on data base the this user is give this mock test and on result page i need graph's data and student real marks 
  *and for the time being i need only read and write api's only
*/