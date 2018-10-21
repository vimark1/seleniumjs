var fs = require('fs');
var test = require('./create-test');
var example = fs.readFileSync(__dirname + '/../../test/files/example4.html', 'utf8').toString();

test.create(__filename, 'html_zombie_mocha', example);
