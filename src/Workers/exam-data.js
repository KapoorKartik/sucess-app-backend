
const { workerData, parentPort } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("../configs/db");
const examId = String(workerData.req);
console.log('examId:', examId)
const getDataFormDb = async () => {
  console.log("2");
  try {
    const db = await connectToDB();
    const collection = db.collection("exam-data");
    const cursor = await collection.find({ examId: examId });
    const res = await cursor.toArray();
    console.log('res:', res[0])
    parentPort.postMessage({ res : res[0].tests  });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
getDataFormDb();