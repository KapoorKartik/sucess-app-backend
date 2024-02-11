const { workerData, parentPort } = require("worker_threads");
const { MongoClient } = require("mongodb");
const testId = String(workerData.req);
//
//
async function performReadOperation() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const filter = {
      testId: testId,
    };

    const coll = client.db("success-app").collection("test-question-set");
    const cursor = coll.find(filter);
    const result = await cursor.toArray();

    parentPort.postMessage({ result: result[0] });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await client.close();
  }
}

// Call the function to perform read operation
performReadOperation();
