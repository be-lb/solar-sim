var assert = require('assert');
var expect = require('expect.js');
var financial = require('../lib/financial');
var building = require('../lib/building');
var roof = require('../lib/roof');
var pv = require('../lib/pv');
var user = require('../lib/user');

describe('Financial', function() {
  describe('Financial()', function() {
    it('should expose an object', function () {
      var f = new financial.Financial();
      expect(f).to.be.a('object');
    });
    it('should expose a function', function () {
      var f = new financial.Financial();
      expect(f.computeElecBuyingPrice).to.be.a('function');
    });
  });
  describe('Computation by year', function() {
    it('should expose a function', function () {
      expect(financial.computeFinancialAmortization).to.be.a('function');
    });
    // TODO tests about results of financial amortization to come here.
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

      p.computeProduction();
      b.pv = p;

      var u = new user.User();
      u.hasWashingMachine = true;
      u.hasElectricWaterHeater = true;
      u.hasElectricHeating = false;
      u.computeAnnualElecConsumption();
      b.user = u;

      var f = new financial.Financial();
      f.building = b;
      f.computeElecBuyingPrice();
      f.computePVCost();

      var year_start = 2018;
      var year_end = 2018+25;
      expect(financial.computeFinancialAmortization(b, f, year_start, year_end)).to.eql([829, 945, 0.10, 5]);
    });
  });
});
