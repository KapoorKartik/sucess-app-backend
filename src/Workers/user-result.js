const { workerData, parentPort } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("../configs/db");
const userId = workerData.req.userId;
const mockId = workerData.req.mockId;
console.log("userId:", userId);
const getDataFormDb = async () => {
  try {
    const db = await connectToDB();
    const filter = { userId };

    const collection = db.collection("user-result");
    const cursor = collection.find(filter, { _id: 1 });
    const res = await cursor.toArray();
    console.log("res:", res[0].m1);
    if (mockId) {
      console.log("mockId is present", mockId);
      parentPort.postMessage({ res: res[0][mockId] });
    } else {
      console.log("mockId is absent");
      parentPort.postMessage({ res });
    }
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
getDataFormDb();
