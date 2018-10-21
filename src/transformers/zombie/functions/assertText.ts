const estemplate = require('./estemplate');

export function transpile(node) {

  const args = node.arguments;

  const template = 'expect(browser.text(<%= selector %>)).toContain(<%= expected %>)';

  const ast = estemplate(template, {
    selector : { type: 'Literal', value: args[0].value },
    expected: { type: 'Literal', value: args[1].value }
  });

  node.callee = ast.callee;
  node.arguments = ast.arguments;

}
