import HtmlParser from '../../src/parsers/HtmlParser';
import JsonParser from '../../src/parsers/JsonParser';
import MarkdownParser from '../../src/parsers/MarkdownParser';
import { TestCaseParserOutput, TestSuiteParserOutput } from '../../src/shared/Selenium';
import { readFileSync } from 'fs';

const testcaseExample = require('../files/example.json');
const testsuiteExample = require('../files/suite-example.json');
const jsonParser = new JsonParser();
const testcaseParsed: TestCaseParserOutput = jsonParser.testCase(testcaseExample);
const testsuiteParsed: TestSuiteParserOutput = jsonParser.testSuite(testsuiteExample);

const html = readFileSync(__dirname + '/../files/example.html').toString();
const htmlParser = new HtmlParser();
const htmltestcaseParsed: TestCaseParserOutput = htmlParser.testCase(html);

const markdown = readFileSync(__dirname + '/../files/example.md').toString();
const markdownParserInstance = new MarkdownParser();
const markdowntestcaseParsed = markdownParserInstance.testCase(markdown);

test('html parser - should create a list of steps from file', () => {
  expect(htmltestcaseParsed.steps.length).toBe(9);
  expect(htmltestcaseParsed.title).toBe('CourseDiscussionsTC');
  expect(htmltestcaseParsed.base).toBe('http://app.localhost:3000/');
});

test('json parser test case - should create a list of steps from json file', () => {
  expect(testcaseParsed.steps.length).toBe(testcaseExample.commands.length);
  expect(testcaseParsed.title).toBe('Untitled');
  expect(testcaseParsed.base).toBe('http://www.example.com/');
});

test('json parser suite - should return the base object for suite', () => {
  expect(Object.keys(testsuiteParsed)).toEqual(['base', 'title', 'tests']);
  expect(testsuiteParsed.title.includes('.js')).toBeFalsy();
  expect(testsuiteParsed.tests.length).toBe(3);
});

test('markdown parser - should create a list of steps from', () => {
  expect(markdowntestcaseParsed.steps.length).toBe(4);
  expect(markdowntestcaseParsed.title).toBe('Sample Post');
  expect(markdowntestcaseParsed.base).toBe('https://localhost:3000/');
});
