var assert = require('assert');
var expect = require('expect.js');
var environmental = require('../lib/environmental');
var building = require('../lib/building');
var roof = require('../lib/roof');
var pv = require('../lib/pv');

describe('environmental', function() {
  describe('Environmental()', function() {
    it('should expose an object', function () {
      var e = new environmental.Environmental();
      expect(e).to.be.a('object');
    });
  });
  describe('Computation', function() {
    it('should expose a function', function () {
      expect(environmental.getEnvironmentalCosts).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.computeEnvironmentalROI).to.be.a('function');
    });
    it('should return true', function() {
      var b = new building.Building();
      b.typology = 'residential';

      var p = new pv.PV();
      p.building = b;
      p.setup = 'default';
      p.getSetupFactor();

      var r = new roof.Roof();
      r.rawArea = 30;
      r.productivity = 950;
      r.building = b;
      r.computeRoofUsableArea();
      r.computeRawPeakPower(p);
      r.computeUsablePeakPower(p);
      b.roofs = [r];
      r.rawPeakPower = 5.7; // HACK because inconsistence dans maquette xls sur la puissance utilisée

      var e = new environmental.Environmental('Belgium');

      expect(environmental.getEnvironmentalCosts(e, r).energeticCost).to.be.equal(14250);

    });
    it('should return true', function() {
      var b = new building.Building();
      b.typology = 'residential';

      var p = new pv.PV();
      p.building = b;
      p.setup = 'default';
      p.getSetupFactor();

      var r = new roof.Roof();
      r.rawArea = 30;
      r.productivity = 950;
      r.building = b;
      r.computeRoofUsableArea();
      r.computeRawPeakPower(p);
      r.computeUsablePeakPower(p);
      b.roofs = [r];
      r.rawPeakPower = 5.7; // HACK because inconsistence dans maquette xls sur la puissance utilisée

      var e = new environmental.Environmental('Belgium');
      console.log(environmental.getEnvironmentalCosts(e, r));
      expect(environmental.getEnvironmentalCosts(e, r).panels).to.be.equal(0.85);

    });
  });
});
