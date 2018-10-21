import { test } from 'ava';
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

test('html parser - should create a list of steps from file', (t) => {
  t.is(htmltestcaseParsed.steps.length, 9);
  t.is(htmltestcaseParsed.title, 'CourseDiscussionsTC');
  t.is(htmltestcaseParsed.base, 'http://app.localhost:3000/');
});

test('json parser test case - should create a list of steps from json file', (t) => {
  t.is(testcaseParsed.steps.length, testcaseExample.commands.length);
  t.is(testcaseParsed.title, 'Untitled');
  t.is(testcaseParsed.base, 'http://www.example.com/');
});

test('json parser suite - should return the base object for suite', (t) => {
  t.deepEqual(Object.keys(testsuiteParsed), ['base', 'title', 'tests']);
  t.falsy(testsuiteParsed.title.includes('.js'));
  t.is(testsuiteParsed.tests.length, 3);
});

test('markdown parser - should create a list of steps from', (t) => {
  t.is(markdowntestcaseParsed.steps.length, 4);
  t.is(markdowntestcaseParsed.title, 'Sample Post');
  t.is(markdowntestcaseParsed.base, 'https://localhost:3000/');
});
