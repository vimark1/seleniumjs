import util from './util';

const transpilers = {
  echo : require('./functions/echo'),
  assertText : require('./functions/assertText'),
  verifyText : require('./functions/assertText'),
  assertTitle : require('./functions/assertTitle'),
  verifyValue : require('./functions/verifyValue'),
  storeText : require('./functions/storeText'),
  waitForElementPresent : require('./functions/waitForElementPresent')
};

const browserAction = require('./functions/browserAction');

export default function(node, seleniumJson) {

  // Changes the base url variable
  if (util.isBaseUrl(node)) {
    node.init.value = seleniumJson.base;
  }

  if (util.isBrowserAction(node)) {
    browserAction.mapping(node);
    browserAction.xpath(node);
  }

  Object.keys(transpilers).forEach(function(f) {
    if (util.isBrowserActionOf(node, 'browser.' + f)) {
      transpilers[f].transpile(node);
    }
  });

  return node;
};
