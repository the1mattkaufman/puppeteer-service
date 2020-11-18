const puppeteer = require("puppeteer");
const util = require("./util");

const openConnection = async (headlessOption, optimize) => {
  const PUPPETEER_OPTIONS = {
    headless: headlessOption === true,
    args: [],
  };
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS).catch((e) => {
    throw e;
  });
  const page = await browser.newPage().catch((e) => {
    throw e;
  });
  await page.setDefaultNavigationTimeout(60000);

  if (optimize) {
    //Optimize performance by stripping out visual elements
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "image" ||
        req.resourceType() === "stylesheet" ||
        req.resourceType() === "font"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  return { browser, page };
};

const closeConnection = async (page, browser) => {
  page &&
    (await page.close().catch((e) => {
      throw e;
    }));
  browser &&
    (await browser.close().catch((e) => {
      throw e;
    }));
};

const runScripts = async (body) => {
  let result = { isSuccess: false };
  let { browser, page } = await openConnection(
    body.headless,
    body.optimize
  ).catch((e) => {
    throw e;
  });
  console.log(body);
  if (body.operation === "githubDescription") {
    result = await getGithubDescription(page, body);
  } else if (body.operation === "takeOverTheWorld") {
    result = await takeOverTheWorld(page);
  } else if (body.url) {
    //good example of a webservice "https://postman-echo.com/get?foo1=bar1&foo2=bar2";
    await page.goto(body.url);
    result.isSuccess = true;
    result.value = await page.content();
    await util.wait(page, 10000);
  }
  await closeConnection(page, browser).catch((e) => {
    throw e;
  });
  return result;
};

/**
 * @name getGithubDescription
 * @description Grabs the description of a Github repo
 * @param {*} page
 * @param {*} body
 */
const getGithubDescription = async (page, body) => {
  let result = { isSuccess: true };
  if (!body.url || body.url.indexOf("github") < 0) {
    body.url = "https://github.com/the1mattkaufman/puppeteer-service";
  }
  await page.goto(body.url);
  await page.waitForTimeout(5000).catch((e) => {
    console.error(e);
  });
  let r = await page.$eval(".mt-3", (el) => el.textContent);
  result.value = r;
  const pageUrl = await page.url();
  result.url = pageUrl;
  await util.wait(page, 5000);
  return result;
};

/**
 * @description Demo of filling out and submitting a form
 */
const takeOverTheWorld = async (page) => {
  result = { isSuccess: true };
  const url = "https://www.survey-maker.com/poll3231341xea7f464b-100";
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  await util.wait(page, 1000);
  await util.clickIt(page, ".qp_a", "innerHTML", "Take over the world");
  // Slow down the page for demo purposes
  await util.wait(page, 1000);
  await util.clickIt(page, "input", "value", "Vote");
  await util.wait(page, 2000);
  await util.clickIt(page, "input", "value", "Next");
  return result;
};

exports.runScripts = runScripts;
