var assert = require('assert');
var expect = require('expect.js');
var user = require('../lib/user');

describe('User', function() {
  describe('User()', function() {
    it('should expose an object', function () {
      var u = new user.User();
      expect(u).to.be.a('object');
    });
    it('should expose a function', function () {
      var u = new user.User();
      expect(u.computeAnnualElecConsumption).to.be.a('function');
    });
  });
  describe('u.computeAnnualElecConsumption() == 3500', function() {
    it('should return true', function() {
      var u = new user.User();
      u.hasWashingMachine = true;
      u.hasElectricWaterHeater = true;
      u.hasElectricHeating = false;
      expect(u.computeAnnualElecConsumption()).to.be.equal(3500);
    });
  });
});
