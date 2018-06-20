var assert = require('assert');
var expect = require('expect.js');
var pv = require('../lib/pv');
var building = require('../lib/building');
var roof = require('../lib/roof');

describe('PV', function() {
  describe('PV()', function() {
    it('should expose an object', function () {
      var p = new pv.PV();
      expect(p).to.be.a('object');
    });
    it('should expose a function', function () {
      var p = new pv.PV();
      expect(p.computeProduction).to.be.a('function');
    });
  });
  describe('p.computeProduction() == 3705', function() {
    it('should return true', function() {
      var b = new building.Building();
      b.obstacleRate = 0;
      var r = new roof.Roof();
      r.rawArea = 30;
      r.productivity = 950;
      r.building = b;
      b.roofs = [r];
      var p = new pv.PV();
      p.building = b;
      expect(p.computeProduction()).to.be.equal(3705);
    });
    it('should return true', function() {
      var b = new building.Building();
      var r = new roof.Roof();
      r.usableArea = 30;
      r.productivity = 950;
      r.building = b;
      b.roofs = [r];
      var p = new pv.PV();
      p.building = b;
      expect(p.computeProduction()).to.be.equal(3705);
    });
  });
});
