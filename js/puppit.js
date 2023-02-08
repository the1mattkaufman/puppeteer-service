const util = require("./util");

const shadowClick = async (page, query, log, time, override) => {
  console.log('evaluating ' + log)
  console.log(query)

  const btnHandle = await page.evaluateHandle(query)

  const btnLength = await btnHandle.evaluate((e) => (e.length))

  if (btnLength) {
    util.log(log, "clicking on "+btnLength)
    for (i = 0; i < btnLength; i++) {
      await (await btnHandle.evaluateHandle((e, i) => e[i], i)).click()
      if (time) {
        await wait(page, time)
      }
    }
  } else {
    util.log(log, "clicking on")
    if (override) {
      console.log('override')
      await btnHandle.evaluate((e) => {
        e.target = "_top"
        e.href = ""
      })
    }
    await btnHandle.click()
    if (time) {
      await wait(page, time)
    }
  }
}

/**
 * @name click
 * @param page
 * @param tagName ( example: 'a' )
 * @param propertyName ( example: 'href' )
 * @param propertyValue ( example: 'mkpartners.com' )
 */
const click = async (page, selector, propertyName, propertyValue, target) => {
  const result = { isSuccess: false, errorMessage: ''};
  if (!target) {
    target = "_top";
  }
  let toClick;
  const elements = await page.$$(selector);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    let elementValue;
    if (propertyName === "id" ){
      elementValue = await page.evaluate((el) => el.id, element);
    }
    else if (propertyName === "innerHTML") {
      elementValue = await page.evaluate((el) => el.innerHTML, element);
    } else if (propertyName == "innerText") {
      elementValue = await page.evaluate((el) => el.innerText, element);
    } else if (propertyName == "value") {
      elementValue = await page.evaluate((el) => el.value, element);
    } else if (propertyName == "href") {
      elementValue = await page.evaluate((el) => el.href, element);
    } else if (propertyName == "name") {
      elementValue = await page.evaluate((el) => el.name, element);
    } else {
      elementValue = await page.evaluate(
        (el, propertyName) => {
          el.getAttribute(propertyName);
        },
        element,
        propertyName
      );
    }
    if (elementValue && elementValue.indexOf(propertyValue) >= 0) {
      toClick = element;
      break;
    }
  }
  if (toClick) {
    util.log( propertyValue, 'clicking on' );
    if (selector === "a" && target) {
      toClick.target = target;
    }
    await toClick.click();
    result.isSuccess = true;
  } else {
    util.log( propertyValue, 'did not find');
    result.errorMessage = 'did not find'+propertyValue;
  }
  return result;
}

const goto = async (page, url) => {
  await page.goto(url).catch((e) => {
    console.error("goto: " + url, e);
  });
}

const getContent = async (page) => {
  const pageContent = await page.content().catch((e) => {
    console.error("getContent", e);
  });
  return pageContent;
}

const getInnerOf = async (page, selector, propertyName, propertyValue) => {
  const result = { isSuccess: false, errorMessage: ''};
  let toFind;
  const sel = '['+propertyName+'="'+propertyValue+'"]';
  const tags = await page.evaluate(() => 
    document.querySelectorAll(sel)
  ,sel);

  // if (tags.length() > 0 ){
  //   tags.forEach((tag) => {
  //     console.log(tag.innerHTML)
  //   })
  //   toFind = tags[0];
  // }
  // const tags = await page.evaluate(() => {
  //   Array.from(document.querySelectorAll(sel), element => {
  //     element.textContent
  //   })
  // });
  util.log(tags,'tags'); 
  // toFind = tags[0];

  // const elements = await page.$$(selector);
  // for (let i = 0; i < elements.length; i++) {
  //   const element = elements[i];
  //   // TODO: Need to fix this to not search the whole page within a for loop
  //   util.log( element , 'element');
  //   util.log( element.attributes , 'element.attributes');
  //   const foundValue = await element.getProperty(propertyName);
  //   util.log( foundValue,'getProperty');
  //   if ( foundValue === propertyValue ){
  //     toFind = element;
  //     break;
  //   }
  //   // if (propertyName.indexOf('data-')===0){
  //   //   const sel = '['+propertyName+'="'+propertyValue+'"]';
  //   //   foundElement = await page.evaluate((sel) => document.querySelector(sel), sel);
  //   //   util.log(foundElement, 'foundElement');
  //   // } else {
  //   //   foundElement = await page.evaluate((el) => el, element);
  //   // }
  //   // if (foundElement) {
  //   //   toFind = foundElement;
  //   //   break;
  //   // }
  // }
  if (toFind) {
    result.textContent = toFind.innerHTML;
    // try {
    //   result.innerText = toFind.textContent;
    // } catch (e){
    //   console.log(e);
    // }
    // try {
    //   result.innerHTML = toFind.innerHTML;
    // } catch (e){
    //   console.log(e);
    // }
    result.isSuccess = true;
  } else {
    util.log( propertyValue, 'did not find');
    result.errorMessage = 'did not find'+propertyValue;
  }
  return result;
}

/**
 * @name type
 * @param {*} page
 * @param {*} selector
 * @param {*} value
 */
const type = async (page, selector, value) => {
  await page.type(selector, value).catch((e) => {
    console.error("type: " + selector + " " + value, e);
  });
}

/**
 * @name selectOption
 * @param {*} page
 * @param {*} selector
 * @param {*} value
 */
const selectOption = async (page, selector, value) => {
  await page.select(selector, value).catch((e) => {
    console.error("selectOption: ", e);
  });
}

/**
 * @name wait
 * @param {*} page
 * @param {*} timeout
 */
const wait = async (page, timeout) => {
  await page.waitForTimeout(timeout);
}

exports.click = click;
exports.shadowClick = shadowClick;
exports.getContent = getContent;
exports.goto = goto;
exports.wait = wait;
exports.type = type;
exports.selectOption = selectOption; 
exports.getInnerOf = getInnerOf;
