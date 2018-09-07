 /*jshint esversion: 6 */

var assert = require('assert');
var expect = require('expect.js');
var thermic = require('../lib/thermic');
var building = require('../lib/building');
var roof = require('../lib/roof');
var financial = require('../lib/financial');

describe('Thermic', function() {
  describe('Thermic()', function() {
    it('should expose an object', function () {
      var t = new thermic.Thermic(5, 30, undefined, 'electric', -9999, -9999, 3, 2500, 0.06);
      expect(t).to.be.a('object');
    });
    it('should expose a function', function () {
      var t = new thermic.Thermic(5, 30, undefined,'electric', -9999, -9999, 3, 2500, 0.06);
      expect(t.computeSolarProduction).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(thermic.getAzimuthBestRoof).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(thermic.computeBalances).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(thermic.computeThermicGain).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(thermic.computeActualReturnTimeThermic).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(thermic.computeProductionPrices).to.be.a('function');
    });
  });
  describe('getAzimuthBestRoof() = 180', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      expect(thermic.getAzimuthBestRoof(b)).to.be.equal(180);
    });
  });
  describe('computeBalances()', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var f = new financial.Financial(-9999, -9999, 0.06, -9999, false, 3, 0.018);
      var nYears = 25;

      var expected = [-4358, -4760, -5262, -5664, -6066, -6563, -6965, -7367, -7858, -8260, -8662, -9148, -9550, -9952, -10433, -10835, -11237, -11714, -12116, -12518, -12991, -13393, -13795, -14263, -14665];
      expect(thermic.computeBalances(t,f,nYears).VANminusConsoWithSolar.map(x => Math.round(x/100)*100)).to.eql(expected.map(x => Math.round(x/100)*100));
    });
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var f = new financial.Financial(-9999, -9999, 0.06, -9999, false, 3, 0.018);
      var nYears = 25;

      var expected = [-715, -1429, -2144, -2859, -3573, -4288, -5003, -5717, -6432, -7147, -7861, -8576, -9291, -10005, -10720, -11435, -12149, -12864, -13579, -14293, -15008, -15723, -16437, -17152, -17867];
      expect(thermic.computeBalances(t,f,nYears).VANminusConsoWithoutSolar.map(x => Math.round(x/100)*100)).to.eql(expected.map(x => Math.round(x/100)*100));
    });
  });
  describe('computeThermicGain = 4905', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var nYears = 10;

      var expected = 4905;
      expect(Math.round(thermic.computeThermicGain(t,nYears))).to.be.equal(expected);
    });
  });
  describe('computeActualReturnTimeThermic = 13.8', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var f = new financial.Financial(-9999, -9999, 0.06, -9999, false, 3, 0.018);
      var nYears = 25;

      var expected = 13.8;
      expect(Math.round(thermic.computeActualReturnTimeThermic(t,f,nYears)*10)/10).to.be.equal(expected);
    });
  });
  describe('computeProductionPrices()', function() {
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var nYears = 25;

      var expected = 0.13;
      expect(Math.round(thermic.computeProductionPrices(t,nYears).productionPriceWithSubsidies*100)/100).to.be.equal(expected);
    });
    it('should return true', function() {
      var b = new building.Building(0.2);
      var r = new roof.Roof(30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var nYears = 25;

      var expected = 0.21;
      expect(Math.round(thermic.computeProductionPrices(t,nYears).productionPriceWithoutSubsidies*100)/100).to.be.equal(expected);
    });
  });
});
