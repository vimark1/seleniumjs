import {
  SeleniumTestCase,
  TestCaseParserOutput,
  TestSuiteParserOutput
} from '../shared/Selenium';
import { humanFilename } from '../shared/Util';

export default class JsonParser {

  public testSuite(testSuiteJson: any): TestSuiteParserOutput {
    return {
      base : testSuiteJson.tests[0].base,
      title : humanFilename(testSuiteJson.filename),
      tests : testSuiteJson.tests.map(this.testCase)
    };
  }

  public testCase(seleniumTestCase: SeleniumTestCase): TestCaseParserOutput {

    seleniumTestCase.commands = seleniumTestCase.commands || [];

    const steps = seleniumTestCase.commands.map((item) => {

      let target = item.target;

      // If the current target is not a css selector and there are
      // other candidates we look to find a new target
      const candidateList = [];
      const weakTarget =
        'link=' === target.slice(0, 5) ||
        '//' === target.slice(0, 2);

      if (weakTarget && item.targetCandidates) {
        item.targetCandidates.forEach(candidate => {
          if (candidate[1] === 'css') {
            candidateList.push(candidate[0]);
          }
        });
        if (candidateList.length) {
          target = candidateList[0];
        }
      }

      return [
        item.command,
        target,
        item.value
      ];
    });

    const base = seleniumTestCase.baseURL;
    const title = seleniumTestCase.title || seleniumTestCase.tempTitle;

    return {
      base,
      steps,
      title,
    };

  }

}
