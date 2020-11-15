const puppeteer = require("puppeteer");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36";
const VIEWPORT = { width: 960, height: 768 };
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
  await page.setUserAgent(USER_AGENT).catch((e) => {
    throw e;
  });
  await page.setViewport(VIEWPORT).catch((e) => {
    throw e;
  });

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
  let result = { isSuccess: true };
  let optimize = false;
  let { browser, page } = await openConnection(body.headless, optimize).catch(
    (e) => {
      throw e;
    }
  );
  console.log(body);
  if (body.operation == "getPostmanEcho") {
    body.url = "https://postman-echo.com/get?foo1=bar1&foo2=bar2";
    await page.goto(body.url);
    result.value = await page.content();
  } else if (body.operation === "githubDescription") {
    body.url = "https://github.com/the1mattkaufman/puppeteer-service";
    await page.goto(body.url);
    await page.waitForTimeout(5000).catch((e) => {
      console.error(e);
    });
    let r = await page.$eval(".mt-3", (el) => el.textContent);
    result.value = r;
    const pageUrl = await page.url();
    result.url = pageUrl;
  } else if (body.operation === "takeOverTheWorld") {
    await takeOverTheWorld(page);
  }
  await closeConnection(page, browser).catch((e) => {
    throw e;
  });
  return result;
};

/**
 * @description Demo of filling out and submitting a form
 */
const takeOverTheWorld = async (page) => {
  const url = "https://www.survey-maker.com/poll3231341xea7f464b-100";
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  await util.wait(page, 1000);
  await util.clickIt(page, ".qp_a", "innerHTML", "Test my website");
  // Slow down the page for demo purposes
  await util.wait(page, 1000);
  await util.clickIt(page, "input", "value", "Vote");
  await util.wait(page, 5000);
};

exports.runScripts = runScripts;
