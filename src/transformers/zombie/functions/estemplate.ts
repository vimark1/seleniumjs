const estemplate = require('estemplate');

module.exports = function(template, data) {
  
  const ast = estemplate(template, data);
  const body = ast.body[0];
  
  return body.expression || body;
  
};
