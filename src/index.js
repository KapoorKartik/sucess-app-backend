const PORT = 80;

const express = require("express");
const { Worker } = require("worker_threads");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/exam-list/", async (req, res) => {
  const worker = new Worker("./src/Workers/exam-list.js");
  worker.on("message", (data) => {
    res.send(data);
  });
  worker.on("error", (msg) => {
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
/* *
 *complete :- first listing page where every test shows
 *second on mock test page of specific test
 *third on question page
 *forth on question submit that save the response of student and send the master result data on front page where result is calculated and saved on backend and updated on data base the this user is give this mock test and on result page i need graph's data and student real marks
 *and for the time being i need only read and write api's only
 */
