const PORT = 80;

const express = require("express");
const { Worker } = require("worker_threads");
const app = express();

app.get("/api/exam-list/", async (req, res) => {
  console.log('321')
  const worker = new Worker("./src/Workers/exam-list.js");
  worker.on("message", (data) => {
    console.log('data frm worker:', data)
    res.send(data);
  });
  worker.on("error", (msg) => {
    console.log('msg:', msg)
    res.send(msg);
  });
});

app.get("/api/exam-data/:id", async (req, res) => {
  const worker = new Worker("./src/Workers/exam-data.js", {
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
  const worker = new Worker("./src/Workers/test-question-set.js", {
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
  const worker = new Worker("./src/Workers/test-answer-set.js", {
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
  console.log(`Listening on port ${PORT}`);
});
