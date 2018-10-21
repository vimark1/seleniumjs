import * as prettify from 'js-prettify';

const packageJson = require('../package.json');

const apiSetup = {
  parsers : ['html', 'json', 'markdown'],
  transformers : ['zombie', 'markdown'],
  wrappers : ['mocha', 'jasmine-node']
};

import HtmlParser from './parsers/HtmlParser';
import JsonParser from './parsers/JsonParser';
import MarkdownParser from './parsers/MarkdownParser';

import ZombieTransformer from './transformers/zombie';
import MarkdownTransformer from './transformers/markdown';

// we need to statically write all the requirers
const requireObjects = {
  parsers : {
    html : (new HtmlParser()).testCase,
    json : (new JsonParser()).testCase,
    markdown : (new MarkdownParser()).testCase
  },
  transformers : {
    zombie : ZombieTransformer,
    markdown : MarkdownTransformer
  },
  wrappers : {
    mocha : require('./wrappers/mocha'),
    jasmineode : require('./wrappers/jasmine-node')
  }
};

// Some transformers will not contain a wrapper by default,
// for example in the initial set the markdown transformer falls into this
// category
const defaultNoWrapperTransformers = {
  markdown : true
};

const nonJSOutput = {
  markdown : true
};

// Test case parsers
const parsers = {};
apiSetup.parsers.forEach((parser) => {
  parsers[parser] = requireObjects.parsers[parser];
});

// Transformers
const transformers = {};
apiSetup.transformers.forEach(function(transformer) {
  transformers[transformer] = requireObjects.transformers[transformer];
});

// Wrappers
const wrappers = {};
apiSetup.wrappers.forEach(function(wrapper) {
  wrappers[wrapper] = requireObjects.wrappers[wrapper];
});

const prettifyOptions = {
  indent_size : 2
};

const api: any = {};

apiSetup.parsers.forEach(function(parser) {
  apiSetup.transformers.forEach(function(transformer) {
    if (parser === transformer) {
      return;
    }
    const method = [parser, transformer].join('_');
    api[method] = function (input, options) {
      let fromParser = parsers[parser](input);
      let result = transformers[transformer](fromParser, options);

      if (nonJSOutput[transformer]) {
        return result.testCode;
      } else {
        return prettify(result.testCode, prettifyOptions);
      }
    };
    if (defaultNoWrapperTransformers[transformer]) {
      return;
    }
    apiSetup.wrappers.forEach(function(wrapper) {
      const method_with_wrapper = [parser, transformer, wrapper].join('_');
      api[method_with_wrapper] = function (input, options) {
        let fromParser = parsers[parser](input);
        let transformerCode = transformers[transformer](fromParser, options);
        let wrapperCode = wrappers[wrapper](transformerCode, fromParser.title, fromParser.title, options);

        if (nonJSOutput[wrapper]) {
          return wrapperCode;
        } else {
          return prettify(wrapperCode, prettifyOptions);
        }
      };
    });
  });
});

api.version = packageJson.version;

module.exports = api;
