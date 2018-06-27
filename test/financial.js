 /*jshint esversion: 6 */

var assert = require('assert');
var expect = require('expect.js');
var financial = require('../lib/financial');
var building = require('../lib/building');
var roof = require('../lib/roof');
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
      var expected = [702, 723, 223, 230, 237, 244, 251, 258, 266, 274, 282, 290, 299, 307, 316, 326, 335, 345, 355, 366, 377, 388, 399, 411, 423];

      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).selfConsumptionAmount.map(x => Math.round(x))).to.eql(expected);
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
      var expected = [756, 755, 755, 755, 754, 754, 754, 753, 753, 752, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).CVAmount.map(x => Math.round(x))).to.eql(expected);
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
      var expected = [1458, 1478, 1046, 1054, 1063, 1072, 1081, 1090, 1099, 1109, 367, 378, 389, 401, -1606, 425, 437, 450, 464, 477, 491, 506, 521, 536, 552];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).balance.map(x => Math.round(x))).to.eql(expected);
    });
    it('should return true - netActualValueByYear', function() {
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
      var expected = [-3567, -2200, -1270, -369, 504, 1352, 2173, 2969, 3742, 4491, 4730, 4966, 5200, 5431, 4540, 4766, 4991, 5213, 5433, 5651, 5867, 6080, 6291, 6501, 6708];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).netActualValueByYear.map(x => Math.round(x/10)*10)).to.eql(expected.map(x => Math.round(x/10)*10));
    });
    it('should return true - actualReturnTimeByYear', function() {
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
      var expected = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).actualReturnTimeByYear.map(x => Math.round(x))).to.eql(expected);
    });
    it('should return true - marginalActualReturnTimeByYear', function() {
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
      var expected = [3.54, 2.61, 2.37, 1.41, 0.42, 0.60, 1.65, 2.73, 3.84, 4.99, 18.82, 20.02, 21.24, 22.46, 6.09, 20.01, 21.23, 22.45, 23.69, 24.95, 26.21, 27.49, 28.78, 30.08, 31.40];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).marginalActualReturnTimeByYear.map(x => Math.round(x*100)/100)).to.eql(expected);
    });
    it('should return true - actualReturnTime', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).actualReturnTime)).to.be.equal(7);
    });
    it('should return true - netActualValue', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).netActualValue)).to.be.equal(5945);
    });
    it('should return true - returnInternalRate', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).returnInternalRate*1000)/1000).to.be.equal(0.127);
    });
    it('should return true - modifiedReturnInternalRate', function() {
      var f = new financial.Financial();
      f.PVCost = 8550;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).modifiedReturnInternalRate*1000)/1000).to.be.equal(0.062);
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
