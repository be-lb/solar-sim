 /*jshint esversion: 6 */

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
    it('should return true - selfConsumptionAmount', function() {
      var b = new building.Building('residential');
      var r = new roof.Roof(30,950, 'default', b);
      b.roofs = [r];
      b.computeProduction();

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
      var currentYear = 2018;
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).selfConsumptionAmount.map(x => Math.round(x))).to.eql([829, 854, 279, 287, 296, 304, 313, 323, 332, 342, 352, 362, 373, 384, 396, 407, 419, 432, 444, 457, 471, 485, 499, 514, 529]);
    });
    it('should return true - CVAmount', function() {
      var b = new building.Building('residential');
      var r = new roof.Roof(30,950, 'default', b);
      b.roofs = [r];
      b.computeProduction();

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
      var currentYear = 2018;
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).CVAmount.map(x => Math.round(x))).to.eql([945, 944, 944, 943, 943, 942, 942, 941, 941, 941, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
    it('should return true - balance', function() {
      var b = new building.Building('residential');
      var r = new roof.Roof(30,950, 'default', b);
      b.roofs = [r];
      b.computeProduction();

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
      var currentYear = 2018;
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).balance.map(x => Math.round(x))).to.eql([1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690]);
    });
    it('should return true - actualReturnTime', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance).actualReturnTime)).to.be.equal(7);
    });
    it('should return true - netActualValue', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance).netActualValue)).to.be.equal(5945);
    });
    it('should return true - returnInternalRate', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance).returnInternalRate*1000)/1000).to.be.equal(0.127);
    });
    it('should return true - modifiedReturnInternalRate', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance).modifiedReturnInternalRate*1000)/1000).to.be.equal(0.062);
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
    it('should return true - computeNetPresentValue', function() {
      var discountRate = 0.04;
      var values = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      expect(Math.round(financial.computeNetPresentValue(discountRate, values))).to.eql(14784);
    });
  });
});


// TODO test sur computeActualPrice
