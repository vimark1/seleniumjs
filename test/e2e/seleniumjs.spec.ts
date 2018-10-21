import { readFileSync } from 'fs';
const expect = require('expect');
const seleniumjs = require('../build');

describe('seleniumjs', function() {

  it('should expose the lib', function () {
    expect(seleniumjs).toBeTruthy();
  });

  it('should expose lib version', function () {
    expect(seleniumjs.version).toBeTruthy();
  });

  describe('test case', function() {

    it('should respond with js code given a selenium json', function () {
      let seleniumJson = require('./files/example.json');
      let testCaseString = seleniumjs.json_zombie_mocha(seleniumJson);
      expect(testCaseString).toBeTruthy();
      expect(testCaseString).toContain('http://www.example.com/');
      expect(testCaseString).toContain(`browser.clickLink('How'`);
    });

  });

  describe('markdown test case', function() {

    it('should return JS code for a selenium case md', function () {
      var seleniumMd = readFileSync(__dirname + '/files/example.md').toString();
      var testCaseString = seleniumjs.markdown_zombie(seleniumMd);
      expect(testCaseString).toBeTruthy();
      expect(testCaseString).toContain(`expect(browser.text('title'))`);
    });

  });

  describe('Options', function() {
    var result;
    var seleniumJson = require('./files/example.json');
    var compiler = function(options) {
      return seleniumjs.json_zombie_mocha(seleniumJson, options);
    };

    describe('before each code', function () {

      beforeEach(function() {
        result = compiler({
          beforeEachCode : 'function() { \n /* to be completed */ \n }'
        });
      });

      it('should render the beforeEachCode', function () {
        expect(result).toBeTruthy();
        expect(result).toContain('/* to be completed */');
      });

    });

    describe('start browser', function () {
      beforeEach(function() {
        result = compiler({
          startBrowser : false
        });
      });

      it('should not start the browser when an option has been passed', function () {
        expect(result).toBeTruthy();
        expect(result).toNotContain('zombie');
      });

    });
  });

});
