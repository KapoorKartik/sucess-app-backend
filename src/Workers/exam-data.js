
import { parentPort } from "worker_threads";
import { connectToDB, closeDBConnection } from "../configs/db";
const examId = String(workerData.req);
const getDataFormDb = async () => {
  console.log("2");
  try {
    const db = await connectToDB();
    const collection = db.collection("exam-data");
    const res = await collection.findOne({ examId: examId });
    console.log('res:', res)
    parentPort.postMessage({ res });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
getDataFormDb();