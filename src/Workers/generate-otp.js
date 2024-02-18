const { workerData, parentPort } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("../configs/db");
const userId = workerData.req;
const getDataFormDb = async () => {
  try {
    const db = await connectToDB();
    const collection = db.collection("otp");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('otp:', otp)
    const res =await collection.insertOne({ userId , otp , timeStamp : Date.now()});
    parentPort.postMessage({ res });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
getDataFormDb();
