import xpath from '../xpath';

const estemplate = require('./estemplate');

export function transpile(node) {

  const args = node.arguments;
  
  const template = 'var <%= varName %> = browser.text(<%= selector %>)';
  const ast = estemplate(template, {
    varName : { type : 'Identifier', name : args[1].value },
    selector : { type : 'Literal', value : xpath(args[0].value) }
  });
  
  delete node.callee;
  delete node.arguments;
  
  node.type = ast.type;
  node.declarations = ast.declarations;
  node.kind = ast.kind;
  
}
