function cleanURL(url) {
  return url.replace(/(\/)\/+/g, '$1');
}
module.exports = cleanURL;
