var assert = require('assert');
var expect = require('expect.js');
var building = require('../lib/building');

describe('Building', function() {
  describe('Building()', function() {
    it('should expose an object', function () {
      var b = new building.Building();
      expect(b).to.be.a('object');
    });
  });
  describe('getObstacleRatePerTypology()', function() {
    it('should expose a function', function () {
      expect(building.getObstacleRatePerTypology).to.be.a('function');
    });
    it('should return true', function() {
      var b = new building.Building();
      b.typology = 'residential';
      expect(building.getObstacleRatePerTypology(b)).to.be.within(0,1);
    });
  });
});
