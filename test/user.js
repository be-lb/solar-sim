var assert = require('assert');
var expect = require('expect.js');
var user = require('../lib/user');
var building = require('../lib/building');

describe('User', function() {
  describe('User()', function() {
    it('should expose an object', function () {
        var b = new building.Building(0.2);
        var u = new user.User(3500, true, true, true, true, b);
        expect(u).to.be.a('object');
    });
    it('should expose a function', function () {
        var b = new building.Building(0.2);
        var u = new user.User(3500, true, true, true, true, b);
        expect(u.computeAnnualElecConsumption).to.be.a('function');
    });
    it('should expose a function', function () {
        var b = new building.Building(0.2);
        var u = new user.User(3500, true, true, true, true, b);
        expect(u.computeSelfConsumptionRate).to.be.a('function');
    });
  });
  describe('u.computeAnnualElecConsumption() == 2036', function() {
    it('should return true', function() {
        var b = new building.Building(0.2);
        var u = new user.User(2036, true, true, false, true, b);
        expect(u.computeAnnualElecConsumption()).to.be.equal(2036);
    });
  });
  describe('u.computeAnnualElecConsumption() == 4372 (with pv heater)', function() {
    it('should return true', function() {
        var b = new building.Building(0.2);
        var u = new user.User(2036, true, true, true, true, b);
        expect(u.computeAnnualElecConsumption()).to.be.equal(4372);
    });
  });
});
