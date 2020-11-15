const express = require("express");
const app = express();
const index = require("./index");
const DEFAULT_BODY = {
  debug: false,
  headless: true,
  operation: "getDescription",
  url: "https://github.com/the1mattkaufman/puppeteer-service",
};

const server = app.listen(process.env.PORT || 8080, (err) => {
  if (err) return console.error(err);
  const port = server.address().port;
  console.info(`App listening on port ${port}`);
});

app.use(async (req, res) => {
  let startTime = new Date();
  let body = {};
  if (req.body) {
    body = req.body;
  }
  if (req.query) {
    for (let q in req.query) {
      body[q] = req.query[q];
    }
  }
  for (let q in DEFAULT_BODY) {
    if (!body.hasOwnProperty(q)) {
      body[q] = DEFAULT_BODY[q];
    }
  }
  let result = await index.runScripts(body);
  result.start = startTime;
  result.end = new Date();
  console.debug(result);
  res.json(result);
});

module.exports = app;
