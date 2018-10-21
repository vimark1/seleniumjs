export function transpile(node) {

  let selector = node.arguments[0].value;
  
  if (selector.slice(0, 6) === 'xpath:') {
    selector = selector.slice(6);
  }

  node.arguments[0] = {
    'type': 'ObjectExpression',
    'properties': [
      {
        'type': 'Property',
        'key': {
          'type': 'Identifier',
          'name': 'element'
        },
        'value': {
          'type': 'Literal',
          'value': selector
        },
        'kind': 'init',
        'method': false,
        'shorthand': false
      }
    ]
  };

  node.callee.name = 'browser.wait';
  
}
