
interface SeleniumTestCaseCommand {
  command: string;
  target: string;
  targetCandidates: any;
  value: string;
  lastURL: string;
}

export interface SeleniumTestCase {
  title: string;
  tempTitle: string;
  baseURL: string;
  commands: SeleniumTestCaseCommand[];
}

export interface TestCaseParserOutput {
  title: string;
  base: string;
  steps: string[][];
}

export interface TestSuiteParserOutput {
  title: string;
  base: string;
  tests: TestCaseParserOutput[];
}

export abstract class Parser {
  abstract testCase(something: any): TestCaseParserOutput;
}
