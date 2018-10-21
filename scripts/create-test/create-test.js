const fs = require('fs');
const path = require('path');
const seleniumjs = require('../../build/');

function create(filename, type, data) {

  if(!seleniumjs[type]) {
    return;
  }

  filename = path.parse(filename).name;
  var testFilename = `generated-${filename}.spec.js`;

  fs.writeFile(
    __dirname + '/../../tests_generated/' + testFilename,
    seleniumjs[type](data)
  );

}

module.exports = {
  create
};
