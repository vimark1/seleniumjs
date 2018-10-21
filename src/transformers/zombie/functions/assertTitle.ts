const estemplate = require('./estemplate');

export function transpile(node) {

  const args = node.arguments;
  
  const template = `
    expect(browser.text("title"))
      .toContain(<%= expected %>)
  `;

  const ast = estemplate(template, {
    expected: { type: 'Literal', value: args[0].value }
  });

  node.callee = ast.callee;
  node.arguments = ast.arguments;

}
