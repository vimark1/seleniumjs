export default {

  isDescribe : function(node) {
    return node.type === 'CallExpression' && node.callee.name === 'describe';
  },

  isIt : function(node) {
    return node.type === 'CallExpression' && node.callee.name === 'it';
  },

  isBaseUrl : function(node) {
    return node.type === 'VariableDeclarator' && node.id.name === 'baseUrl';
  },

  isBrowserAction : function(node) {
    return (
        node.type === 'CallExpression' &&
        (
          (node.callee && node.callee.name && node.callee.name.slice(0, 8) === 'browser.')
          ||
          (node.object && node.object.name === 'browser')
        )
      );
  },

  isBrowserActionOf : function(node, callee) {
    return true &&
      this.isBrowserAction(node) &&
      node.callee &&
      node.callee.name === callee;
  },

  isBrowserClickToLink : function(node) {
    return true &&
      this.isBrowserAction(node) &&
      node.callee &&
      (node.callee.name === 'browser.click' || node.callee.name === 'browser.clickAndWait') &&
      node.arguments[0].value.slice(0, 5) === 'link=';
  }

};
