var assert = require('assert');
var expect = require('expect.js');
var environmental = require('../lib/environmental');
var building = require('../lib/building');
var roof = require('../lib/roof');

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
      expect(environmental.computeEnergeticReturn).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.computeSavedCO2Emissions).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.sum).to.be.a('function');
    });
    it('should return true - energeticCost', function() {
      var b = new building.Building('closed');
      var r = new roof.Roof(30,950, 'default', 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      r.rawPeakPower = 5.7; // HACK because inconsistence dans maquette xls sur la puissance utilisée

      var e = new environmental.Environmental('Belgium');

      expect(environmental.getEnvironmentalCosts(e, b).energeticCost).to.be.equal(14250);

    });
    it('should return true - panels costs', function() {
      var b = new building.Building('closed');
      var r = new roof.Roof(30,950, 'default', 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      r.rawPeakPower = 5.7; // HACK because inconsistence dans maquette xls sur la puissance utilisée

      var e = new environmental.Environmental('Belgium');

      expect(environmental.getEnvironmentalCosts(e, b).panels).to.be.equal(0.85);
    });
    it('should return true - energeticReturnFactor', function() {
      var energeticCost = 7800;
      var production = 2964;
      var actualProduction = [2964, 2963, 2961, 2960, 2958, 2957, 2955, 2954, 2952, 2951, 2949, 2948, 2946, 2945, 2943, 2942, 2940, 2939, 2937, 2936, 2935, 2933, 2932, 2930, 2929];
      expect(Math.round(environmental.computeEnergeticReturn(energeticCost, production, actualProduction).energeticReturnFactor*10)/10).to.be.equal(9.4);
    });
    it('should return true - energeticReturnTime', function() {
      var energeticCost = 7800;
      var production = 2964;
      var actualProduction = [2964, 2963, 2961, 2960, 2958, 2957, 2955, 2954, 2952, 2951, 2949, 2948, 2946, 2945, 2943, 2942, 2940, 2939, 2937, 2936, 2935, 2933, 2932, 2930, 2929];
      expect(Math.round(environmental.computeEnergeticReturn(energeticCost, production, actualProduction).energeticReturnTime*10)/10).to.be.equal(2.6);
    });
    it('should return true - computeSavedCO2Emissions', function() {
      var actualProduction = [2964, 2963, 2961, 2960, 2958, 2957, 2955, 2954, 2952, 2951, 2949, 2948, 2946, 2945, 2943, 2942, 2940, 2939, 2937, 2936, 2935, 2933, 2932, 2930, 2929];
      expect(Math.round(environmental.computeSavedCO2Emissions(actualProduction))).to.be.equal(33589);
    });
    it('should return true - sum', function() {
      expect(environmental.sum([1,2,3,-1])).to.be.equal(5);
    });
  });
});
