import * as cloneDeep from 'lodash.clonedeep';

import xpath from './xpath';

export function list2tree(tree) {

  // List of async commands
  const callbackFn = [
    'browser.open',
    'browser.click',
    'browser.clickLink',
    'browser.pause',
    'browser.waitForPageToLoad',
    'browser.waitForElementPresent',
    'browser.waitForElementNotPresent',
    'browser.clickAndWait'
  ];

  const resultTree = [];
  let parent;

  tree
    .map(function(args) {
      return {
        func : args.splice(0, 1).pop(),
        args : args.filter(Boolean)
      };
    })
    .forEach(function(step) {
      if (!parent) {
        resultTree.push(step);
      }
      if (parent) {
        parent.children.push(step);
      }
      if (callbackFn.indexOf(step.func) > -1) {
        step.children = step.children || [];
        parent = step;
      }
    });

  return resultTree;

}

export function parseTree(tree) {

  const ast = [];

  tree.forEach(function(step) {
    const func = step.func;

    let args = step.args.map(function(arg) {
      return {
        type : 'Literal',
        value : arg,
        raw : arg
      };
    });

    if (step.children && step.children.length) {
      args.push({
        type: 'FunctionExpression',
        id : null,
        params : [],
        body : {
          type : 'BlockStatement',
          body : parseTree(step.children)
        }
      });
    }

    ast.push({
      type : 'ExpressionStatement',
      expression : {
        type : 'CallExpression',
        callee : { type : 'Identifier', name : func },
        arguments : args
      }
    });

  });

  return ast;

}

export function steps2ast(steps) {

  function isClickLink(command) {
    return /^link=/.test(command[1]);
  }

  // All steps are mapped as a `browser.` function
  steps = cloneDeep(steps).map((command) => {

    if (isClickLink(command)) {
      command[0] = 'clickLink';
    }

    // transfor selenium paths to something that works better
    // with zombie
    command[1] = xpath(command[1]);

    // prepend browser
    command[0] = 'browser.' + command[0];

    return command;
  });

  // Adds a last step which calls the done function
  // it tells jasmine-node that we're `done` with async tests
  steps.push(['done']);

  const stepsTree = list2tree(steps);

  return {
    type : 'Program',
    body : parseTree(stepsTree)
  };

}
