const expect = require('expect');
<%= browserSetupCode %>

describe('<%= testSuiteTitle %>', function() {
  this.timeout(2.5 * 60 * 1000);

  <% if(typeof beforeEachCode !== 'undefined') { %>
  beforeEach(<%= beforeEachCode %>);
  <% } %>

  <%= testCasesCode %>

});
