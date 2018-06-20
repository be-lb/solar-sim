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
  });
  describe('computeRoofUsableArea()', function() {
    it('should expose a function', function () {
      expect(roof.computeRoofUsableArea).to.be.a('function');
    });
    it('should return true', function() {
      var b = new building.Building();
      b.typology = 'residential';
      var r = new roof.Roof();
      r.rawArea = 120;
      r.building = b;
      expect(roof.computeRoofUsableArea(r)).to.be.lessThan(r.rawArea);
    });
  });
});
