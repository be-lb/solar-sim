var assert = require('assert');
var expect = require('expect.js');
var roof = require('../lib/roof');
var building = require('../lib/building');

describe('Roof', function() {
  describe('Roof()', function() {
    it('should expose an object', function () {
      var r = new roof.Roof();
      expect(r).to.be.a('object');
    });
    it('should expose a function', function () {
      var r = new roof.Roof();
      expect(r.computeRoofUsableArea).to.be.a('function');
    });
  });
  describe('computeRoofUsableArea() < rawArea', function() {
    it('should return true', function() {
      var b = new building.Building('residential');
      b.getObstacleRatePerTypology();
      var r = new roof.Roof();
      r.rawArea = 30;
      r.building = b;
      expect(r.computeRoofUsableArea()).to.be.lessThan(r.rawArea);
    });
  });
});
