var assert = require('assert');
var building = require('../lib/building');

describe('Building()', function() {
  describe('computeUsefulArea()', function() {
    it('should return true', function() {
      var b = new building.Building();
      assert.equal(building.computeUsefulArea(b), 1000);
    });
  });
});
