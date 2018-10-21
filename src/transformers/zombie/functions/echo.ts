const estemplate = require('./estemplate');

export function transpile(node) {

  const args = node.arguments;
  
  let varName = args[0].value;
  let astData;
  
  const containVariable = /\$\{\w+\}/.test(args[0].value);
  if (containVariable) {
    varName = varName.replace(/\W/g, '');
    astData = {
      type: 'Identifier',
      name : varName
    };
  } else {
    astData = {
      type: 'Literal',
      value : varName
    };
  }

  const ast = estemplate('console.log(<%= varName %>)', {
    varName : astData
  });
  
  node.callee = ast.callee;
  node.arguments = ast.arguments;
  
}
