const PORT = 80;

const express = require("express");
const { Worker } = require("worker_threads");
const app = express();

app.get("/api/exam-list/", async (req, res) => {
  const worker = new Worker("./Workers/exam-list.js");
  worker.on("message", (data) => {
    res.send(data);
  });
  worker.on("error", (msg) => {
    res.send(msg);
  });
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
