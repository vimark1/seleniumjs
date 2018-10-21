<%= browserSetupCode %>

jasmine.getEnv().defaultTimeoutInterval = 4 * 60 * 1000;

describe('<%= testSuiteTitle %>', function() {

  beforeEach(
  <% if(typeof beforeEachCode !== 'undefined') { %>
    <%= beforeEachCode %>
  <% } else { %>
  function(done) {
    done();
  }
  <% } %>
  );

  <%= testCasesCode %>
  
});
