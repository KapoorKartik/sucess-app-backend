const { workerData, parentPort } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("../configs/db");
const mobileNumber = workerData.req;
const getDataFormDb = async () => {
  try {
    const db = await connectToDB();
    const collection = db.collection("users");
    const res = await collection.findOne({ mobileNumber }, { _id: 1 });
    console.log("cursor f:", res);
    // const res = await cursor.toArray();
    parentPort.postMessage({ res });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
getDataFormDb();
