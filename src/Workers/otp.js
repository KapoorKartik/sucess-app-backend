const { workerData, parentPort } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("../configs/db");
const mobileNumber = workerData?.mobileNumber;
const flag = workerData?.flag;
const otp = workerData?.otp;
const generateOtp = async () => {
  try {
    const db = await connectToDB();
    const collection = db.collection("otp-log");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const res = await collection.insertOne({
      mobileNumber,
      otp,
      timeStamp: Date.now(),
    });
    parentPort.postMessage({ res: otp });
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
    const cursor = collection.find({ mobileNumber }).sort({ _id: -1 }).limit(1);
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



const tempFxnForCreatingResult = async () => {
   try {
  const db = await connectToDB();
  const collection = db.collection("user-result");
  const res = await collection.insertOne({
    userId: "1",
    m1: {
      correct: 2,
      incorrect: 5,
      totalScore: 50,
      ansObj: {
        q0: "Not Paris",
        q1: "Jane Austen",
        q2: "Mars",
        q3: "Silver",
        q4: "1905",
        q5: "Leonardo da Vinci",
        q6: "Pound",
        q7: "Canberra",
        q8: "Alan Turing",
        q9: "12",
        q10: "Mars",
        q11: "Cherry Blossom",
        q12: "Harper Lee",
        q13: "1989",
        q14: "Au",
        q15: "Alexander Fleming",
        q16: "Pacific Ocean",
        q17: "Japan",
        q18: "Alexander Graham Bell",
        q19: "299,792 kilometers per second",
      },
    },
  })
  console.log('13')
    parentPort.postMessage({ res });
} catch (error) {
    console.error("Error in worker:", error.message);
    parentPort.postMessage({ error: error.message });
  } finally {
    await closeDBConnection();
  }
  
};

if (flag === "generateOtp") {
  generateOtp();
  // tempFxnForCreatingResult();
} else if (flag === "verifyOtp") {
  verifyOtp();
}