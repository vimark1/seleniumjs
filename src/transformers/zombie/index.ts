import { readFileSync } from 'fs';
import * as cloneDeep from 'lodash.clonedeep';
import * as esprima from 'esprima';
import * as estraverse from 'estraverse';
import * as escodegen from 'escodegen';

import { steps2ast } from './testcase-transformer';
import handleTraverse from './traverse';

const template = readFileSync(__dirname + '/template.js').toString();

function transform (json) {

  const browserSetupAst = esprima.parse(template);

  // Builds an ast from the steps definition array
  const htmlAst = steps2ast(json.steps);

  const browserSetupCode = escodegen.generate(
    traverse(browserSetupAst, json)
  );

  const testCode = escodegen.generate(
    traverse(htmlAst, json)
  );
  
  const title = json.title;

  return {
    title,
    browserSetupCode,
    testCode
  };
}

function traverse(ast, json) {
  return estraverse.replace(ast, {
    enter: (node) => {
      return handleTraverse(node, json);
    }
  });
}

export default function(json) {
  
  // clone the json object
  json = cloneDeep(json);
  
  // suite mode contain tests
  if (json.tests) {
    json.tests = json.tests.map(transform);
    return json.tests;
  }
  
  return transform(json);
};
