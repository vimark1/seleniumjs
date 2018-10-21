import { TestCaseParserOutput } from '../../shared/Selenium';

export default function(json: TestCaseParserOutput) {

  const { base, title } = json;

  let testCode = `---
baseUrl:  ${base}
title: ${title}
---

Command | Target | Value
------- | ------ | ----- |
`;

  testCode += json.steps
    .map((step) => step.join(' | '))
    .join('\n')
    .trim();

  return { testCode, title };

};
