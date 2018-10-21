import { readFileSync } from 'fs';
import helper from '../helper';

const suiteTemplate = readFileSync(__dirname + '/testsuite.js').toString();
const caseTemplate = readFileSync(__dirname + '/testcase.js').toString();

module.exports = function(result, testSuiteTitle, testCaseTitle, options) {

  return helper({
    result,
    testSuiteTitle,
    testCaseTitle,
    options,
    suiteTemplate,
    caseTemplate
  });

};
