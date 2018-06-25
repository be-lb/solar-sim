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
      expect(environmental.computeEnergeticReturn).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.computeCO2Emissions).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.sum).to.be.a('function');
    });
    it('should return true - energeticCost', function() {
      var b = new building.Building('residential');
      var r = new roof.Roof(30,950, 'default', b);
      b.roofs = [r];
      b.computeProduction();
      r.rawPeakPower = 5.7; // HACK because inconsistence dans maquette xls sur la puissance utilisée

      var e = new environmental.Environmental('Belgium');

      expect(environmental.getEnvironmentalCosts(e, b).energeticCost).to.be.equal(14250);

    });
    it('should return true - panels costs', function() {
      var b = new building.Building('residential');
      var r = new roof.Roof(30,950, 'default', b);
      b.roofs = [r];
      b.computeProduction();
      r.rawPeakPower = 5.7; // HACK because inconsistence dans maquette xls sur la puissance utilisée

      var e = new environmental.Environmental('Belgium');

      expect(environmental.getEnvironmentalCosts(e, b).panels).to.be.equal(0.85);
    });
    it('should return true - energeticReturnFactor', function() {
      var energeticCost = 14250;
      var production = 3705;
      var actualProduction = [3705, 3703, 3701, 3699, 3698, 3696, 3694, 3692, 3690, 3688, 3687, 3685, 3683, 3681, 3679, 3677, 3675, 3674, 3672, 3670, 3668, 3666, 3664, 3663, 3661];
      expect(Math.round(environmental.computeEnergeticReturn(energeticCost, production, actualProduction).energeticReturnFactor*10)/10).to.be.equal(6.5);
    });
    it('should return true - energeticReturnTime', function() {
      var energeticCost = 14250;
      var production = 3705;
      var actualProduction = [3705, 3703, 3701, 3699, 3698, 3696, 3694, 3692, 3690, 3688, 3687, 3685, 3683, 3681, 3679, 3677, 3675, 3674, 3672, 3670, 3668, 3666, 3664, 3663, 3661];
      expect(Math.round(environmental.computeEnergeticReturn(energeticCost, production, actualProduction).energeticReturnTime*10)/10).to.be.equal(3.8);
    });
    it('should return true - computeCO2Emissions', function() {
      var actualProduction = [3705, 3703, 3701, 3699, 3698, 3696, 3694, 3692, 3690, 3688, 3687, 3685, 3683, 3681, 3679, 3677, 3675, 3674, 3672, 3670, 3668, 3666, 3664, 3663, 3661];
      expect(Math.round(environmental.computeCO2Emissions(actualProduction))).to.be.equal(29000);
    });
    it('should return true - sum', function() {
      expect(environmental.sum([1,2,3,-1])).to.be.equal(5);
    });
  });
});
