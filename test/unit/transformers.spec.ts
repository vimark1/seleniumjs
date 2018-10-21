import { test } from 'ava';
import { readFileSync } from 'fs';
import * as escodegen from 'escodegen';
import * as esprima from 'esprima';
import * as requireDir from 'require-dir';

import HtmlParser from '../../src/parsers/HtmlParser';
import JsonParser from '../../src/parsers/JsonParser';
import { steps2ast } from '../../src/transformers/zombie/testcase-transformer';

import traverse from '../../src/transformers/zombie/traverse';
import util from '../../src/transformers/zombie/util';
import xpath from '../../src/transformers/zombie/xpath';

import markdownTransform from '../../src/transformers/markdown';
import zombieTransformer from '../../src/transformers/zombie';

const zombieFunctions = requireDir('../../src/transformers/zombie/functions/');

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

test('should get a code and browser setup code', (t) => {
  t.truthy(code);
  t.truthy(code.includes('assertTitle | Example |'));
  // should resemble a valid front matter
  t.is(/^baseUrl/gm.test(code), true);
  t.truthy(jsonTestCaseMarkdownOutput.title.includes('Untitled'));
});

test('should be a valid javascript AST tree', (t) => {
  const codeFromAst = escodegen.generate(htmlTestCaseAST);
  t.is(codeFromAst.split('\n').length, 15);
});

test('zombie util - should get a code and browser setup code', ( t ) => {
  t.truthy(jsonTestCaseZombieOutput.testCode);
  t.truthy(jsonTestCaseZombieOutput.browserSetupCode);
  t.truthy(jsonTestCaseZombieOutput.browserSetupCode.includes('baseUrl'));
});

test('should find a browser action of', ( t ) => {
  const node = {
    type : 'CallExpression',
    callee : { name : 'browser.click' },
    arguments : [{ value : 'link=something' }]
  };
  t.truthy(util.isBrowserAction(node));
  t.truthy(util.isBrowserActionOf(node, 'browser.click'));
  t.falsy(util.isBrowserActionOf(node, 'browser.clickAndWait'));
  t.falsy(util.isBrowserActionOf(node, '.click'));
  t.falsy(util.isBrowserActionOf(node, 'click'));
});

test('xpath functions return expected results', ( t ) => {
  t.is(xpath('id=something'), '#something');
  t.is(xpath('identifier=something'), '#something,[name=something]');
  t.is(xpath('name=something'), '[name=something]');
  t.is(xpath('link=something'), 'something');
  t.is(xpath('css=something'), 'something');
});

function esprima_parse(code) {
  return esprima.parse(code).body[0].expression;
}

test('browserAction - should convert selenium to zombie commands', t => {
  const node = {
    type : 'CallExpression',
    callee : { name : 'browser.clickAndWait' },
    arguments : [{ value : 'link=something' }]
  };
  zombieFunctions.browserAction.mapping(node);
  t.is(node.callee.name, 'browser.click');
});

test('assertText - converts assertText into a zombie+jasmine expect', t => {
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
  t.is(node.callee.type, 'MemberExpression');
  t.truthy(copy.includes('.header'));
  t.truthy(copy.includes('Welcome!'));
  t.truthy(copy.includes('expect'));
  t.truthy(copy.includes('toContain'));
});

test('should translate the browser.echo to a console.log', t => {
  const node = esprima_parse('browser.echo("${something}")');
  const node2 = esprima_parse('browser.echo("Hello world!")');
  const node3 = esprima_parse('browser.echo(123123)');
  zombieFunctions.echo.transpile(node);
  zombieFunctions.echo.transpile(node2);
  zombieFunctions.echo.transpile(node3);
  t.is(escodegen.generate(node), 'console.log(something)');
  t.truthy(escodegen.generate(node2).includes('Hello world!'));
  t.truthy(escodegen.generate(node2).includes('console.log'));
  t.is(escodegen.generate(node3), 'console.log(123123)');
});

test('storeText - should translate the browser.store to a variable declaration', t => {
  const node = esprima_parse('browser.store("id=myBanner", "myVar")');
  zombieFunctions.storeText.transpile(node);
  t.truthy(escodegen.generate(node).includes('var myVar ='));
  t.truthy(escodegen.generate(node).includes('#myBanner'));
});

test('verifyValue - should translate the browser.verifyValue to a variable declaration', t => {
  const node = esprima_parse('browser.verifyValue("id=myInput", "my search")');
  zombieFunctions.verifyValue.transpile(node);
  t.truthy(escodegen.generate(node).includes('browser.query(\'#myInput\').value'));
  t.truthy(escodegen.generate(node).includes('my search'));
});
