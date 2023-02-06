/**
 * @name checkTor
 * @param {*} page 
 * @returns 
 */
 const checkTor = async (page) => {
  await page.goto("https://check.torproject.org/api/ip", {
    waitUntil: "networkidle2"
  }).catch(e => {
    console.error(e);
  });
  const pageContent = await page.content().catch((e) => { console.error(e) });
  let res = {};
  try {
    let body = '{'+substringBetween(pageContent, '{','}')+'}';
    res = JSON.parse(body);
  } catch (e) {
    log( pageContent, 'checkTor', 'log' );
    console.error(e);
  }
  return res;
};

/**
 * @name contains
 * @param {*} txt 
 * @param {*} searchFor 
 * @returns 
 */
const contains = ( txt, searchFor ) => {
  return txt.indexOf( searchFor ) >= 0 ;
}

const isFalse = (value) => {
  return (!value || !isTrue(value));
}

/**
 * @name isTrue
 * @param {*} value
 */
 const isTrue = (value) => {
  return (
    value &&
    (value === "true" || value === true || value === 1 || value === "1")
  );
};

const randomUserAgent = () => {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36 Edg/103.0.1264.62',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
  ];
  return agents[getRandomInt(agents.length)];
}

/**
 * @name substringAfter
 * @param {*} txt 
 * @param {*} after 
 * @returns 
 */
const substringAfter = ( txt, after) => {
  let t;
  if ( txt.indexOf(after) >= 0 ){
    t = txt.substring( txt.indexOf(after)+after.length );  
  }
  return t;
}

/**
 * @name substringBefore
 * @param {*} txt 
 * @param {*} before 
 * @returns 
 */
const substringBefore = ( txt, before) => {
  let t;
  if ( txt.indexOf(before) > 0 ){
    t = txt.substring(0, txt.indexOf(before) );
  }
  return t;
}

/**
 * @name substringBetween
 * @param {*} txt 
 * @param {*} after 
 * @param {*} before 
 * @returns 
 */
const substringBetween = (txt, after, before) => {
  let t = substringAfter(txt, after);
  if ( t ){
    t = substringBefore(t, before);
  }
  return t;
}

/**
 * @name getRandomInt
 * @param {number} max
 */
 const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * @name log
 * @param {*} toLog 
 * @param {*} message 
 * @param {*} level 
 */
const log = (toLog, message='', level='log') => {
  if ( level === 'error' ){
    console.error(message, toLog);
  }
  else if ( level === 'log' ){
    console.log(message, toLog);
  }
};

exports.checkTor = checkTor;
exports.contains = contains;
exports.getRandomInt = getRandomInt;
exports.randomUserAgent = randomUserAgent;
exports.isFalse = isFalse;
exports.isTrue = isTrue;
exports.log = log;
exports.substringAfter = substringAfter;
exports.substringBefore = substringBefore;
exports.substringBetween = substringBetween;