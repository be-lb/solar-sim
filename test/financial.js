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
  });
  describe('Computation by year', function() {
    it('should expose a function', function () {
      expect(financial.computeFinancialAmortization).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeSimplifiedFinancialAmortization).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeActualPrice).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeNetPresentValue).to.be.a('function');
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
      f.computePVCost();

      var nYears = 25;
      expect(financial.computeFinancialAmortization(b, f, nYears)).to.eql([829, 945, 7, 5944, 0.127, 0.062]);
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
      f.computePVCost();

      var nYears = 25;
      var results = financial.computeFinancialAmortization(b, f, nYears);

      expect(financial.computeSimplifiedFinancialAmortization(p, f, results[0], results[1], nYears).productionPrice).to.eql(0.10);
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
      f.computePVCost();

      var nYears = 25;
      var results = financial.computeFinancialAmortization(b, f, nYears);

      expect(financial.computeSimplifiedFinancialAmortization(p, f, results[0], results[1], nYears).simpleReturnTime).to.eql(5);
    });
    it('should return true', function() {
      var discountRate = 0.04;
      var values = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      expect(Math.round(financial.computeNetPresentValue(discountRate, values))).to.eql(14784);
    });
  });
});


// TODO test sur computeActualPrice
