import * as esprima from 'esprima';

export function mapping(node) {

  // Converts some selenium calls to zombie, those
  // that are not too much trouble to do, others
  const straightMappings = {
    open : 'visit',
    type : 'fill',
    clickAndWait : 'click',
    runScript : 'evaluate',
    pause : 'wait',
    waitForPageToLoad : 'wait'
  };

  const funcName = node.callee ? node.callee.name.slice(8) : null;

  if (funcName in straightMappings) {
    node.callee.name = node.callee.name.slice(0, 8) + straightMappings[funcName];
  }
}

export function xpath(node) {

  // These are the function calls we want to replace
  const useXPathObj = {
    text: 1,
    fill: 1,
    click: 1,
    clickLin: 1
  };

  let zombieVar;
  let funcName;
  if (node.callee) {
    const parts = node.callee.name.split('.');
    zombieVar = parts[0];
    funcName = parts[1];
  } else if (node.type === 'MemberExpression') {
    zombieVar = node.object.name;
    funcName = node.property.name;
  }

  if (!useXPathObj[funcName]) {
    return;
  }

  const selector = node.arguments[0].value;
  if (selector.slice(0, 6) !== 'xpath:') {
    return;
  }

  const ast = esprima.parse(
    zombieVar + '.xpath("' + selector.slice(6) + '").iterateNext()'
  );
  
  // Replaces node with expression for xpath
  node.arguments[0] = ast.body[0].expression;

}
