const { workerData, parentPort } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("../configs/db");
const mobileNumberFetch = workerData?.mobileNumber;
const { firstName, lastName, email, pinCode, dob : dobStr, mobileNumber } =
  workerData?.body;
const flag = workerData?.flag;

const fetchUserByMobileNumber = async () => {
  try {
    const db = await connectToDB();
    const collection = db.collection("users");
    const res = await collection.findOne({ mobileNumberFetch }, { _id: 1 });
    parentPort.postMessage({ res });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
const createUser = async () => {
  try {
    const db = await connectToDB();
    const collection = db.collection("users");
    const timeStamp = Date.now();
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const dob = new Date(dobStr);
    console.log("dob:", dob);
    const res = await collection.insertOne({
      timeStamp,
      dob,
      attemptedMockTests: [],
      fullName,
      mobileNumber,
      userType: "free",
      email,
      pinCode,
    });
    console.log("res:", res);

    parentPort.postMessage({ res });
  } catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
};
if (flag === "fetchUser") {
  fetchUserByMobileNumber();
} else if (flag === "createUser") {
  console.log("flag:", flag);
  createUser();
}
