var assert = require('assert');
var expect = require('expect.js');
var building = require('../lib/building');
var roof = require('../lib/roof');

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
    it('should expose a function', function () {
      var b = new building.Building();
      expect(b.computeProduction).to.be.a('function');
    });
  });
  describe('b.getObstacleRatePerTypology() == [0, 1]', function() {
    it('should return true', function() {
      var b = new building.Building('closed');
      expect(b.getObstacleRatePerTypology()).to.be.within(0,1);
    });
  });
  describe('b.computeProduction() == 2964', function() {
    it('should return true', function() {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 'default', 'poly', b);
      b.roofs = [r];
      expect(b.computeProduction()).to.be.equal(2964);
    });
  });
});
