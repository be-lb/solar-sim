var assert = require('assert');
var expect = require('expect.js');
var building = require('../lib/building');
var roof = require('../lib/roof');

describe('Building', function() {
  describe('Building()', function() {
    it('should expose an object', function () {
      var b = new building.Building(0.2);
      expect(b).to.be.a('object');
    });
    it('should expose a function', function () {
      var b = new building.Building(0.2);
      expect(b.computeProduction).to.be.a('function');
    });
    it('should expose a function', function () {
      var b = new building.Building(0.2);
      expect(b.computePower).to.be.a('function');
    });
    it('should expose a function', function () {
      var b = new building.Building(0.2);
      expect(b.computePVArea).to.be.a('function');
    });
  });
  describe('b.computeProduction() == 2964', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      expect(b.computeProduction()).to.be.equal(2964);
    });
  });
  describe('b.computePower() == 2964', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      expect(b.computePower()).to.be.equal(3.12);
    });
  });
  describe('b.computePVArea() == 2964', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      b.pvArea = -9999;
      var r = new roof.Roof(30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      expect(b.computePVArea()).to.be.equal(24);
    });
  });
});
