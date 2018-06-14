var assert = require('assert');
var example = require('../lib/example');

describe('Student("Jane", "M.", "User")', function() {
  describe('greeter()', function() {
    it('should return Hello, Jane User', function() {
      var user = new example.Student("Jane", "M.", "User");
      assert.equal(example.greeter(user), "Hello, Jane User");
    });
  });
});
