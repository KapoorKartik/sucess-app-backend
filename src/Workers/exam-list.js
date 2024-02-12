const { workerData, parentPort } = require("worker_threads");
const { MongoClient } = require("mongodb");
const {
  connectToDB,
  closeDBConnection,
  isConnected,
} = require("../configs/db");

async function getAllCollections() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const filter = {};
    const sort = {
      _id: 1,
    };

    const coll = client.db("sucess-app").collection("exam-list");
    const cursor = coll.find(filter, { sort });
    const result = await cursor.toArray();

    parentPort.postMessage({ result: result });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await client.close();
  }
}

// Call the function to get all collections
// getAllCollections();

const myFxn = async () => {
  console.log("2");
  try {
    const db = await connectToDB();
    const collection = db.collection("exam-list");
    console.log("1");
    const add = await collection.insertOne({
      testName: "IIT Jee",
      validity: "6 month",
      totalTest: "20",
      examId: "2",
    });
    console.log("add:", add);
    const res = collection.find({}, { _id: 1 });
    const data = await res.toArray();
    parentPort.postMessage({ data });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
myFxn();
