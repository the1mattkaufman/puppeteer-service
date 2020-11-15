const debugURL = await (page) => {
  const pageUrl = await page.url();
  console.debug(pageUrl);
  return pageUrl;
};