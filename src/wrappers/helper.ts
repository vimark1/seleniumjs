import { render } from 'ejs';

export default function(obj: any) {

  const caseTemplate  = obj.caseTemplate;
  const options       = obj.options || {};
  const result        = obj.result;
  const suiteTemplate = obj.suiteTemplate;
  const suiteTitle    = obj.testSuiteTitle || 'Single test suite';
  const testCaseTitle = obj.testCaseTitle || 'case test';

  const ejsOptions = {
    // escape(str: string): string {
    //   return str;
    // }
  };

  const browserSetupCode = result.browserSetupCode || result[0].browserSetupCode;

  let testCasesCode = '';

  function renderTestCase(title, code) {
    return render(caseTemplate, {
      testCaseTitle : title,
      testCaseCode : code
    }, ejsOptions);
  }

  if (result.length) {
    result.forEach((test) => {
      testCasesCode += renderTestCase(test.title, test.testCode);
    });
  } else {
    testCasesCode += renderTestCase(testCaseTitle, result.testCode);
  }

  // Replace test code with result
  const suiteOptions = {
    browserSetupCode : options.startBrowser === false ? '' : browserSetupCode,
    testCasesCode,
    suiteTitle,
    ...options
  };

  return render(suiteTemplate, suiteOptions, ejsOptions);

}
