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
      expect(financial.computeActualAnnualProduction).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.getFinancialYear1).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeFinancialAmortization).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeSimplifiedFinancialAmortization).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeActualFinancialAmortization).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeActualPrice).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeNetPresentValue).to.be.a('function');
    });
  });
  describe('Computation by year', function() {
    it('should return true - annualProduction', function() {
      var production = 3705;
      var productionYearlyLossIndex = 0.0005;
      var nYears = 25;
      expect(financial.computeActualAnnualProduction(production, productionYearlyLossIndex, nYears).map(x => Math.round(x))).to.eql([3705, 3703, 3701, 3699, 3698, 3696, 3694, 3692, 3690, 3688, 3687, 3685, 3683, 3681, 3679, 3677, 3675, 3674, 3672, 3670, 3668, 3666, 3664, 3663, 3661]);
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
    it('should return true - productionPrice', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var nYears = 25;
      var production = 3705;
      var selfConsumptionAmountYear1 = 829;
      var CVAmountYear1 = 945;
      expect(Math.round(financial.computeSimplifiedFinancialAmortization(f, production, selfConsumptionAmountYear1, CVAmountYear1, nYears).productionPrice*10)/10).to.be.equal(0.10);
    });
    it('should return true - simpleReturnTime', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var nYears = 25;
      var production = 3705;
      var selfConsumptionAmountYear1 = 829;
      var CVAmountYear1 = 945;
      expect(Math.round(financial.computeSimplifiedFinancialAmortization(f, production, selfConsumptionAmountYear1, CVAmountYear1, nYears).simpleReturnTime)).to.be.equal(5);
    });
    it('should return true', function() {
      var discountRate = 0.04;
      var values = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      expect(Math.round(financial.computeNetPresentValue(discountRate, values))).to.eql(14784);
    });
  });
});


// TODO test sur computeActualPrice
