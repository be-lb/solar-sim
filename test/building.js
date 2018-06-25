var assert = require('assert');
var expect = require('expect.js');
var building = require('../lib/building');

describe('Building', function() {
  describe('Building()', function() {
    it('should expose an object', function () {
      var b = new building.Building();
      expect(b).to.be.a('object');
    });
    it('should expose a function', function () {
      var b = new building.Building();
      expect(b.getObstacleRatePerTypology).to.be.a('function');
    });
  });
  describe('b.getObstacleRatePerTypology() == [0, 1]', function() {
    it('should return true', function() {
      var b = new building.Building('residential');
      expect(b.getObstacleRatePerTypology()).to.be.within(0,1);
    });
  });
});
