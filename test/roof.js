var assert = require('assert');
var expect = require('expect.js');
var roof = require('../lib/roof');
var building = require('../lib/building');

describe('Roof', function() {
  describe('Roof()', function() {
    it('should expose an object', function () {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 30, 'default', 'poly', b);
      expect(r).to.be.a('object');
    });
    it('should expose a function', function () {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 30, 'default', 'poly', b);
      expect(r.getSetupFactor).to.be.a('function');
    });
    it('should expose a function', function () {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 30, 'default', 'poly', b);
      expect(r.computeRoofUsableArea).to.be.a('function');
    });
    it('should expose a function', function () {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 30, 'default', 'poly', b);
      expect(r.computeRawPeakPower).to.be.a('function');
    });
    it('should expose a function', function () {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 30, 'default', 'poly', b);
      expect(r.computeUsablePeakPower).to.be.a('function');
    });
    it('should expose a function', function () {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 30, 'default', 'poly', b);
      expect(r.computeRoofProduction).to.be.a('function');
    });
  });
  describe('computeRoofUsableArea() < rawArea', function() {
    it('should return true', function() {
      var b = new building.Building('closed');
      var r = new roof.Roof(30, 950, 30, 'default', 'poly', b);
      r.building = b;
      expect(r.computeRoofUsableArea()).to.be.lessThan(r.rawArea);
    });
  });
});
