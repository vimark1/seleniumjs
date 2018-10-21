var fs = require('fs');
var test = require('./create-test');
var example = fs.readFileSync(__dirname + '/../../test/files/wikipedia.md', 'utf8').toString();

test.create(__filename, 'markdown_zombie_mocha', example);
