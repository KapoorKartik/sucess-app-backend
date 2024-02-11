const { workerData, parentPort } = require("worker_threads");
const { MongoClient } = require("mongodb");

async function getAllCollections() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const filter = {};
    const sort = {
      _id: 1,
    };

    const coll = client.db("success-app").collection("exam-list");
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
getAllCollections();
