/**
 * @name wait
 * @param page
 * @param milliseconds ( example: '5000' )
 */
const wait = async (page, milliseconds) => {
  await page.waitForTimeout(5000).catch((e) => {
    console.error(e);
  });
};

/**
 * @name clickIt
 * @param page
 * @param tagName ( example: 'a' )
 * @param propertyName ( example: 'href' )
 * @param propertyValue ( example: 'mkpartners.com' )
 */
const clickIt = async (page, selector, propertyName, propertyValue, target) => {
  console.log(
    "clickIt " + selector + " where " + propertyName + " = " + propertyValue
  );
  let toClick;
  const elements = await page.$$(selector);
  for (let element of elements) {
    let elementValue;
    if (propertyName === "innerHTML") {
      elementValue = await page.evaluate((el) => el.innerHTML, element);
    } else if (propertyName == "innerText") {
      elementValue = await page.evaluate((el) => el.innerText, element);
    } else if (propertyName == "value") {
      elementValue = await page.evaluate((el) => el.value, element);
    }
    if (elementValue && elementValue.indexOf(propertyValue) >= 0) {
      toClick = element;
      break;
    }
  }
  if (toClick) {
    if (selector === "a" && target) {
      toClick.setAttribute("target", target);
    }
    await toClick.click();
  }
};

exports.clickIt = clickIt;
exports.wait = wait;
