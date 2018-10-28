import { readFileSync } from 'fs';
import * as escodegen from 'escodegen';
import * as esprima from 'esprima';
import * as requireDirectory from 'require-directory';

import HtmlParser from '../../src/parsers/HtmlParser';
import JsonParser from '../../src/parsers/JsonParser';
import { steps2ast } from '../../src/transformers/zombie/testcase-transformer';

import traverse from '../../src/transformers/zombie/traverse';
import util from '../../src/transformers/zombie/util';
import xpath from '../../src/transformers/zombie/xpath';

import markdownTransform from '../../src/transformers/markdown';
import zombieTransformer from '../../src/transformers/zombie';

const zombieFunctions = requireDirectory(module, '../../src/transformers/zombie/functions/');

const html = readFileSync(__dirname + '/../files/example.html').toString();
const example = require('../files/example.json');

const jsonParser = new JsonParser();
const htmlParser = new HtmlParser();

const jsonTestCaseObject = jsonParser.testCase(example);
const jsonTestCaseMarkdownOutput = markdownTransform(jsonTestCaseObject);
const code = jsonTestCaseMarkdownOutput.testCode;

const htmlTestCaseObject = htmlParser.testCase(html);
const htmlTestCaseAST = steps2ast(htmlTestCaseObject.steps);

const jsonTestCaseZombieOutput = zombieTransformer(jsonTestCaseObject);

test('should get a code and browser setup code', () => {
  expect(code).toBeTruthy();
  expect(code.includes('assertTitle | Example |')).toBeTruthy();
  // should resemble a valid front matter
  expect(/^baseUrl/gm.test(code)).toBe(true);
  expect(jsonTestCaseMarkdownOutput.title.includes('Untitled')).toBeTruthy();
});

test('should be a valid javascript AST tree', () => {
  const codeFromAst = escodegen.generate(htmlTestCaseAST);
  expect(codeFromAst.split('\n').length).toBe(15);
});

test('zombie util - should get a code and browser setup code', () => {
  expect(jsonTestCaseZombieOutput.testCode).toBeTruthy();
  expect(jsonTestCaseZombieOutput.browserSetupCode).toBeTruthy();
  expect(jsonTestCaseZombieOutput.browserSetupCode.includes('baseUrl')).toBeTruthy();
});

test('should find a browser action of', () => {
  const node = {
    type : 'CallExpression',
    callee : { name : 'browser.click' },
    arguments : [{ value : 'link=something' }]
  };
  expect(util.isBrowserAction(node)).toBeTruthy();
  expect(util.isBrowserActionOf(node, 'browser.click')).toBeTruthy();
  expect(util.isBrowserActionOf(node, 'browser.clickAndWait')).toBeFalsy();
  expect(util.isBrowserActionOf(node, '.click')).toBeFalsy();
  expect(util.isBrowserActionOf(node, 'click')).toBeFalsy();
});

test('xpath functions return expected results', () => {
  expect(xpath('id=something')).toBe('#something');
  expect(xpath('identifier=something')).toBe('#something,[name=something]');
  expect(xpath('name=something')).toBe('[name=something]');
  expect(xpath('link=something')).toBe('something');
  expect(xpath('css=something')).toBe('something');
});

function esprima_parse(code) {
  return esprima.parse(code).body[0].expression;
}

test('browserAction - should convert selenium to zombie commands', () => {
  const node = {
    type : 'CallExpression',
    callee : { name : 'browser.clickAndWait' },
    arguments : [{ value : 'link=something' }]
  };
  zombieFunctions.browserAction.mapping(node);
  expect(node.callee.name).toBe('browser.click');
});

test('assertText - converts assertText into a zombie+jasmine expect', () => {
  const node = {
    type : 'CallExpression',
    callee : { type: '', name : 'browser.assertText' },
    arguments : [
      { value : '.header' },
      { value : 'Welcome!' }
    ]
  };
  zombieFunctions.assertText.transpile(node);
  const copy = JSON.stringify(node);
  expect(node.callee.type).toBe('MemberExpression');
  expect(copy.includes('.header')).toBeTruthy();
  expect(copy.includes('Welcome!')).toBeTruthy();
  expect(copy.includes('expect')).toBeTruthy();
  expect(copy.includes('toContain')).toBeTruthy();
});

test('should translate the browser.echo to a console.log', () => {
  const node = esprima_parse('browser.echo("${something}")');
  const node2 = esprima_parse('browser.echo("Hello world!")');
  const node3 = esprima_parse('browser.echo(123123)');
  zombieFunctions.echo.transpile(node);
  zombieFunctions.echo.transpile(node2);
  zombieFunctions.echo.transpile(node3);
  expect(escodegen.generate(node)).toBe('console.log(something)');
  expect(escodegen.generate(node2).includes('Hello world!')).toBeTruthy();
  expect(escodegen.generate(node2).includes('console.log')).toBeTruthy();
  expect(escodegen.generate(node3)).toBe('console.log(123123)');
});

test('storeText - should translate the browser.store to a variable declaration', () => {
  const node = esprima_parse('browser.store("id=myBanner", "myVar")');
  zombieFunctions.storeText.transpile(node);
  expect(escodegen.generate(node).includes('var myVar =')).toBeTruthy();
  expect(escodegen.generate(node).includes('#myBanner')).toBeTruthy();
});

test('verifyValue - should translate the browser.verifyValue to a variable declaration', () => {
  const node = esprima_parse('browser.verifyValue("id=myInput", "my search")');
  zombieFunctions.verifyValue.transpile(node);
  expect(escodegen.generate(node).includes('browser.query(\'#myInput\').value')).toBeTruthy();
  expect(escodegen.generate(node).includes('my search')).toBeTruthy();
});
