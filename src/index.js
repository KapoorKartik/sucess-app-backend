const PORT = 80;

const express = require("express");
const { Worker } = require("worker_threads");
const app = express();


app.get("/",(req,res)=>{
  res.send("Working on port 80")
  try {
    require.resolve("worker_threads");
    console.log("worker_threads module is present");
  } catch (error) {
    console.error("worker_threads module is not present");
  }
})
app.get("/api/exam-list/", async (req, res) => {
  // const worker = new Worker("./Workers/exam-list.js");
  // worker.on("message", (data) => {
  // res.send("data");
  // });
  // worker.on("error", (msg) => {
  // res.send(msg);
  // });
  console.log('worker0:')
  const tick = performance.now()
  const worker = new Worker("./src/Workers/exam-list.js", {
    workerData: "worker1",
  });
  const worker2 = new Worker("./src/Workers/exam-list.js", {
    workerData: "worker2",
  });
  worker.on("message", (data) => {
    // res.send(data);
    console.log('data:', data)
  });
  worker.on("error", (msg) => {
  res.send(msg);
  });
  worker2.on("message", (data) => {
    // res.send(data);
    console.log('data:', data)
  });
  worker2.on("error", (msg) => {
    res.send(msg);
  });
  const tok = performance.now()
  const time = tok - tick
  console.log('time:', time + ' ms')
});

app.get("/api/exam-data/:id", async (req, res) => {
  const worker = new Worker("./Workers/exam-data.js", {
    workerData: { req: req.params.id },
  });
  worker.on("message", (data) => {
    res.send(data);
  });
  worker.on("error", (msg) => {
    res.send(msg);
  });
});

app.get("/api/test-question-set/:testId", (req, res) => {
  const worker = new Worker("./Workers/test-question-set.js", {
    workerData: { req: req.params.testId },
  });
  worker.on("message", (data) => {
    res.send(data);
  });
  worker.on("error", (msg) => {
    res.send(msg);
  });
});

app.get("/api/test-answer-set/:testId", (req, res) => {
  const worker = new Worker("./Workers/test-answer-set.js", {
    workerData: { req: req.params.testId },
  });
  worker.on("message", (data) => {
    res.send(data);
  });
  worker.on("error", (msg) => {
    res.send(msg);
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
