const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const puppeteer = require("puppeteer");
const pup = require("./puppit");
const util = require("./js/util");
const USER_AGENT = util.randomUserAgent();

const server = app.listen(process.env.PORT || 8080, (err) => {
  if (err) return console.error(err);
  const port = server.address().port;
  console.info(`App listening on port ${port}`);
});

app.use(bodyParser.json())

app.use(async (req, res) => {
  let result = await handleRequest(req, res).catch( e => { 
    console.error(e)
    return { isSuccess: false, error: e};
  });
  const statusCode = result.isSuccess ? 200 : 400;
  res.status(statusCode).json(result);
});

const handleRequest = async (req, res) => {
  let startTime = new Date();
  let body = {};
  if (req.body && req.header("content-type") === "application/json") {
    util.log(req.body,
      "request header content-type is application/json and auto parsing the req body as json"
    );
    body = req.body;
  } else if (req.body) {
    util.log( req.body,
      "request header content-type is NOT application/json and MANUALLY parsing the req body as json"
    );
    body = JSON.parse(req.body);
  }
  if (req.query) {
    for (let q in req.query) {
      body[q] = req.query[q];
    }
  }
  console.debug("requestBody", JSON.stringify(body));

  let { browser, page } = await openConnection(body).catch((e) => {
    util.log( e, 'openConnection', 'error' );
  });
  let checkTor;
  if (body && body.useTor && util.isTrue(body.useTor)) {
    checkTor = await util.checkTor(page).catch((e) => {
      util.log( e, 'checkTor', 'error');
    });
  }
  let result = {};
  result.inputBody = body;
  result.start = startTime;
  if (checkTor){
    result.checkTor = checkTor;
  }

  if ( body.url && body.url.indexOf('hilton.com') > 0 ){
    await pup.goto(page, body.url);
    util.log(await page.url(), 'startUrl');
    await Promise.all([
      page.waitForNavigation(),
      result = await pup.getInnerOf(page, "p", "data-testid", "priceInfo")
    ]);
  }

  await closeConnection(page, browser).catch((e) => {
    console.error("closeConnection", e);
  });
  result.end = new Date();
  console.debug("responseBody", JSON.stringify(result));
  return result;
}

/**
 * @name openConnection
 * @param {*} body 
 * @returns 
 */
const openConnection = async (body) => {
  let PUPPETEER_OPTIONS = {
    headless: true
  };
  let args = [];
  args.push("--no-sandbox");
  args.push("--disable-setuid-sandbox");

  // if body.headless is false, it breaks out
  if ( body && util.isFalse(body.headless) ) {
    PUPPETEER_OPTIONS.headless = false;
  }
  if (body && body.useTor && util.isTrue(body.useTor)) {
    args.push("--proxy-server=http://127.0.0.1:8118");
  }
  if (args && args.length > 0) {
    PUPPETEER_OPTIONS.args = args;
  }
  // console.log("PUPPETEER_OPTIONS", JSON.stringify(PUPPETEER_OPTIONS));
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS).catch((e) => {
    util.log( e, "puppeteer.launch", 'error' );
    throw e;
  });
  const page = await browser.newPage().catch((e) => {
    util.log( e, "browser.newPage", 'error' );
    throw e;
  });
  try {
    await page.setDefaultNavigationTimeout(60000);
  } catch (e){
    console.error('Could not set timeout',e)
  }
  await page
    .setUserAgent(USER_AGENT)
    .catch((e) => {
      console.error("page.setUserAgent", e);
    });
  await page.setViewport({ width: 960, height: 768 }).catch((e) => {
    console.error("page.setViewport", e);
  });
  return { browser, page };
};

/**
 * @name closeConnection
 * @param {*} page 
 * @param {*} browser 
 */
const closeConnection = async (page, browser) => {
  console.log("closeConnection");
  page &&
    (await page.close().catch((e) => {
      throw e;
    }));
  browser &&
    (await browser.close().catch((e) => {
      throw e;
    }));
  console.log("killing processes");
};

module.exports = app;