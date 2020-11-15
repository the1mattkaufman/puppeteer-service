const puppeteer = require("puppeteer");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36";
const VIEWPORT = { width: 960, height: 768 };

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
  await page.goto(body.url);

  if (body.operation === "githubDescription") {
    await page.waitForTimeout(5000).catch((e) => {
      console.error(e);
    });
    let r = await page.$eval(".mt-3", (el) => el.textContent);
    console.log(r);
    result.value = r;
    const pageUrl = await page.url();
    result.url = pageUrl;
  }
  await closeConnection(page, browser).catch((e) => {
    throw e;
  });
  return result;
};

exports.runScripts = runScripts;
