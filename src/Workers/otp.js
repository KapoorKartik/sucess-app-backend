const { workerData, parentPort } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("../configs/db");
const userId = workerData.userId;
const flag = workerData.flag;
const otp = workerData.otp;
const generateOtp = async () => {
  try {
    const db = await connectToDB();
    const collection = db.collection("otp-log");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const res = await collection.insertOne({
      userId,
      otp,
      timeStamp: Date.now(),
    });
    parentPort.postMessage({ res });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};

const verifyOtp = async () => {
  try {
    const currentTimeStamp = Date.now();
    const db = await connectToDB();
    const collection = db.collection("otp-log");
    const cursor = collection.find({ userId }).sort({ _id: -1 }).limit(1);
    const resArr = await cursor.toArray();
    const res = resArr[0];
    const isExpired = currentTimeStamp - res.timeStamp > 10 * 60 * 1000;

    let msg = "OTP has expired";
    if (!isExpired && otp === res.otp) {
      msg = "OTP has verifed";
    } else if (!isExpired) {
      msg = "Wrong Otp";
    }

    parentPort.postMessage({ res: msg });
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};

if (flag === "generateOtp") {
  generateOtp();
} else if (flag === "verifyOtp") {
  verifyOtp();
}
