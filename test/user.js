var assert = require('assert');
var expect = require('expect.js');
var user = require('../lib/user');
var building = require('../lib/building');

describe('User', function() {
  describe('User()', function() {
    it('should expose an object', function () {
      var b = new building.Building(0.2);
      var u = new user.User(true, true, true, true, b);
      expect(u).to.be.a('object');
    });
    it('should expose a function', function () {
        var b = new building.Building(0.2);
        var u = new user.User(true, true, true, true, b);
      expect(u.computeAnnualElecConsumption).to.be.a('function');
    });
  });
  describe('u.computeAnnualElecConsumption() == 3500', function() {
    it('should return true', function() {
        var b = new building.Building(0.2);
        var u = new user.User(true, true, true, true, b);
        u.hasWashingMachine = true;
        u.hasElectricWaterHeater = true;
        u.hasElectricHeating = false;
        expect(u.computeAnnualElecConsumption()).to.be.equal(3500);
    });
  });
});
