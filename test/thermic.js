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
      var t = new thermic.Thermic(5, 30, 'electric', -9999, -9999, 3, 2500, 0.06);
      console.log(t)
      expect(t).to.be.a('object');
    });
    it('should expose a function', function () {
      var t = new thermic.Thermic(5, 30, 'electric', -9999, -9999, 3, 2500, 0.06);
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
      var r = new roof.Roof(30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(5, 30, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var f = new financial.Financial(-9999, -9999, 0.06, -9999, false, 3, 0.018);
      var nYears = 25;

      var expected = [-4358, -4760, -5262, -5664, -6066, -6563, -6965, -7367, -7858, -8260, -8662, -9148, -9550, -9952, -10433, -10835, -11237, -11714, -12116, -12518, -12991, -13393, -13795, -14263, -14665];
      expect(thermic.computeBalances(t,f,nYears).VANminusConsoWithSolar.map(x => Math.round(x/1000)*1000)).to.eql(expected.map(x => Math.round(x/1000)*1000));
    });
  });
});
