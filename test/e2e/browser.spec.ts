const expect = require('expect');
const Browser = require('zombie');
const brains = require('./helpers/brains');

var baseUrl = 'http://localhost:3003';

describe('Browser API for seleniumjs', function() {
  
  const browser = new Browser({site: baseUrl});
  
  before(function() {
    return brains.ready();
  });
  
  before(function() {
    brains.static('/browserify', `
      <html>
        <head>
        <script src="/bundle.js" charset="utf-8"></script>
        </head>
        <body>
          <p>hello from brains</p>
        </body>
      </html>
    `);
  });
  
  beforeEach(function(done) {
    browser.visit('/browserify', done);
  });
  
  it('should display initial page', function () {
    expect(browser.html()).toContain('hello from brains');
  });
  
  it('load the bundle.js file', function () {
    var resources = browser.resources
      .filter(function(resource) {
        return resource.request;
      })
      .map(function(resource) {
        var res = resource.response;
        return res.url + '>' + res.statusCode;
      })
      .join('|');
    expect(resources).toContain('bundle.js');
  });
  
  it('should expose the lib as a global', function () {
    expect(browser.window.seleniumjs).toExist();
  });
  
  it('should expose lib version', function () {
    expect(browser.window.seleniumjs.version).toBeTruthy();
  });
  
  it('should respond with js code given a selenium json', function () {
    var seleniumJson = require('./files/example.json');
    var testCaseString = browser.window.seleniumjs.json_zombie_mocha(seleniumJson);
    expect(testCaseString).toBeTruthy();
    expect(testCaseString).toContain('http://www.example.com/');
    expect(testCaseString).toContain(`browser.clickLink('How'`);
  });
  
  it.skip('should return JS code for a selenium suite', function () {
    var seleniumJson = require('./files/suite-example.json');
    var testCaseString = browser.window.seleniumjs.json_zombie_mocha(seleniumJson);
    expect(testCaseString).toBeTruthy();
    expect(testCaseString).toContain('builder01');
    expect(testCaseString).toContain(`should log me in`);
    expect(testCaseString).toContain(`take me to user profile`);
    expect(testCaseString).toContain(`logout take me to logout message`);
  });
  
  after(function() {
    browser.destroy();
  });

});
