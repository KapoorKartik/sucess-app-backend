const { parentPort } = require("worker_threads");
const { MongoClient } = require("mongodb");
const { connectToDB, closeDBConnection } = require("../configs/db");

const myFxn = async () => {
  console.log("2");
  try {
    const db = await connectToDB();
    const collection = db.collection("exam-list");
    const cursor = collection.find({}, { _id: 1 });
    const res = await cursor.toArray();
    parentPort.postMessage({ res });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
myFxn();
