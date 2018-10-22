 /*jshint esversion: 6 */

var assert = require('assert');
var expect = require('expect.js');
var financial = require('../lib/financial');
var building = require('../lib/building');
var roof = require('../lib/roof');
var user = require('../lib/user');
var constants = {
    max_power: 12,
    co2_emissions_by_kwh: 0.456,
    meter_cost: 289,
    onduleur_cost_factor: 250,
    onduleur_replacement_rate: 15,
    redevance_cost: 65,
    pvheater_cost: 1700,
    battery_cost: 7000,
    inflation_rate: 0.02,
    elec_buying_price: 0.23,
    elec_index: 0.03,
    discount_rate: 0.04,
    cv_rate_switch_power: 5,
    cv_rate_low_power: 3,
    cv_rate_high_power: 2.4,
    cv_time: 10,
    cv_end_of_compensation_year: 2020,
    production_yearly_loss_index: 0.0005,
    maintenance_cost_factor: 0.0075,
    max_solar_productivity: 1300,
    flat_roof_tilt: 5,
    low_productivity_limit: 800,
    annual_consumption_base: 600,
    washing_machine_factor: 600,
    electric_water_heater_factor: 2336,
    electric_heating_factor: 16500,
    thermic_installation_cost: 6000,
    thermic_maintenance_cost: 100,
    max_liter_per_day: 210,
    min_thermic_area: 5,
    lost_space_rate: 0,

    energetic_cost_factor: { 'Belgium': 2500, 'Europe': 2600, 'China': 2750 },
    breakdown_cost_factor: {
        'Belgium': { 'panels': 0.85, 'setup': 0.04, 'inverter': 0.09, 'transportBE': 0.02, 'transportEU': 0, 'transportBoat': 0 },
        'Europe': { 'panels': 0.81, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.05, 'transportBoat': 0 },
        'China': { 'panels': 0.77, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.02, 'transportBoat': 0.08 },
    },
    pv_yield: {
        'poly': 0.13,
        'mono': 0.155,
        'mono_high': 0.22
    },
    pv_cost: {
        'poly': 1400 / 1.06,
        'mono': 1500 / 1.06,
        'mono_high': 1600 / 1.06
    },
    self_production: {
        "default": {
            "0.6": 0.25,
            "1": 0.3,
            "1.4": 0.34,
            "1.8": 0.36,
            "2.2": 0.38,
            "2.6": 0.39,
            "3": 0.4,
        },
        "energySobriety": {
            "0.6": 0.28,
            "1": 0.32,
            "1.4": 0.35,
            "1.8": 0.37,
            "2.2": 0.38,
            "2.6": 0.39,
            "3": 0.4,
        },
        "chargeShift": {
            "0.6": 0.3,
            "1": 0.34,
            "1.4": 0.36,
            "1.8": 0.38,
            "2.2": 0.39,
            "2.6": 0.4,
            "3": 0.41,
        },
        "pvHeater": {
            "0.6": 0.43,
            "1": 0.49,
            "1.4": 0.54,
            "1.8": 0.55,
            "2.2": 0.57,
            "2.6": 0.58,
            "3": 0.6,
        },
        "battery": {
            "0.6": 0.48,
            "1": 0.54,
            "1.4": 0.59,
            "1.8": 0.62,
            "2.2": 0.64,
            "2.6": 0.66,
            "3": 0.69,
        }
    },
    hot_water_producer_yield: {
        'gas': 0.70,
        'fuel': 0.55,
        'electric': 0.95
    },
    hot_water_energy_cost: {
        'gas': 0.080,
        'fuel': 0.081,
        'electric': 0.267
    },
    hot_water_energy_cost_index: {
        'gas': 0.054,
        'fuel': 0.099,
        'electric': 0.04
    },
    co2_emissions_by_kwh_thermic: {
        'gas': 0.201,
        'fuel': 0.263,
        'electric': 0.456 // NB: should be equal to CO2_EMISSIONS_BY_KWH
    },
    thermic_production: {
        "60": {
            "90": 519,
            "112.5": 534,
            "135": 546,
            "157.5": 553,
            "180": 555,
            "202.5": 553,
            "225": 546,
            "247.5": 534,
            "270": 519,
        },
        "90": {
            "90": 742,
            "112.5": 767,
            "135": 787,
            "157.5": 800,
            "180": 804,
            "202.5": 800,
            "225": 787,
            "247.5": 767,
            "270": 742,
        },
        "120": {
            "90": 932,
            "112.5": 968,
            "135": 997,
            "157.5": 1015,
            "180": 1022,
            "202.5": 1015,
            "225": 997,
            "247.5": 968,
            "270": 932,
        },
        "150": {
            "90": 1097,
            "112.5": 1145,
            "135": 1183,
            "157.5": 1207,
            "180": 1215,
            "202.5": 1207,
            "225": 1183,
            "247.5": 1145,
            "270": 1097,
        },
        "180": {
            "90": 1262,
            "112.5": 1321,
            135: 1368,
            157.5: 1398,
            "180": 1408,
            "202.5": 1398,
            "225": 1368,
            "247.5": 1321,
            "270": 1262,
        },
        210: {
            90: 1364,
            112.5: 1432,
            135: 1487,
            157.5: 1522,
            180: 1534,
            202.5: 1522,
            225: 1487,
            247.5: 1432,
            270: 1364,
        }
    },
};

describe('Financial', function() {
  describe('Financial()', function() {
    it('should expose an object', function () {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      expect(f).to.be.a('object');
    });
    it('should expose a function', function () {
      expect(financial.computeActualAnnualProduction).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.getFinancialYearN).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeFinancialBenefit).to.be.a('function');
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
      expect(financial.computeActualReturnTime).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeActualPrice).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.computeNetPresentValue).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(financial.getInstallationCost).to.be.a('function');
    });
  });
  describe('Computation by year', function() {
    it('should return true - annualProduction', function() {
      var production = 3705;
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      var nYears = 25;
      expect(financial.computeActualAnnualProduction(production, f, nYears).map(x => Math.round(x))).to.eql([3705, 3703, 3701, 3699, 3698, 3696, 3694, 3692, 3690, 3688, 3687, 3685, 3683, 3681, 3679, 3677, 3675, 3674, 3672, 3670, 3668, 3666, 3664, 3663, 3661]);
    });
    it('should return true - selfConsumptionAmount', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();

      var u = new user.User(constants, 3500, true, true, true, true, b);
      u.computeSelfConsumptionRate();
      u.selfProductionRate = 0.3;
      b.user = u;

      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.building = b;
      f.computePVCost();
      f.computeOtherCost();
      f.onduleurCost=1500;
      f.computeAnnualMaintenanceCost();
      f.computeCVRate();

      var nYears = 25;
      var currentYear = 2018;
      var expected = [702, 723, 223, 230, 237, 244, 251, 258, 266, 274, 282, 290, 299, 307, 316, 326, 335, 345, 355, 366, 377, 388, 399, 411, 423];

      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).selfConsumptionAmount.map(x => Math.round(x))).to.eql(expected);
    });
    it('should return true - CVAmount', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();

      var u = new user.User(constants, 3500, true, true, true, true, b);
      u.computeSelfConsumptionRate();
      b.user = u;

      var f = new financial.Financial(constants, 0.03, 85, 0.06, 0, false, 5, 0.01);
      f.building = b;
      f.computePVCost();
      f.computeOtherCost();
      f.onduleurCost=1500;
      f.computeAnnualMaintenanceCost();
      f.computeCVRate();

      var nYears = 25;
      var currentYear = 2018;
      var expected = [756, 755, 755, 755, 754, 754, 754, 753, 753, 752, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).CVAmount.map(x => Math.round(x))).to.eql(expected);
    });
    it('should return true - balance', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();

      var u = new user.User(constants, 3500, true, true, true, true, b);
      u.computeSelfConsumptionRate();
      u.selfProductionRate = 0.3;
      b.user = u;

      var f = new financial.Financial(constants, 0.03, 85, 0.06, 0, false, 5, 0.01);
      f.building = b;
      f.computePVCost();
      f.computeOtherCost();
      f.onduleurCost=1500;
      f.computeAnnualMaintenanceCost();
      f.computeCVRate();

      var nYears = 25;
      var currentYear = 2018;
      var expected = [1458, 1478, 1046, 1054, 1063, 1072, 1081, 1090, 1099, 1109, 367, 378, 389, 401, -1606, 425, 437, 450, 464, 477, 491, 506, 521, 536, 552];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).balance.map(x => Math.round(x))).to.eql(expected);
    });
    it('should return true - netActualValueByYear', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();

      var u = new user.User(constants, 3500, true, true, true, true, b);
      u.computeSelfConsumptionRate();
      u.selfProductionRate = 0.3;
      b.user = u;

      var f = new financial.Financial(constants, 0.03, 85, 0.06, 0, false, 5, 0.01);
      f.building = b;
      //f.computePVCost();
      f.onduleurCost=1500;
      f.PVCost = 4680;
      f.otherCost = 0;
      f.computeAnnualMaintenanceCost();
      f.computeCVRate();

      var nYears = 25;
      var currentYear = 2018;
      var expected = [-3567, -2200, -1270, -369, 504, 1352, 2173, 2969, 3742, 4491, 4730, 4966, 5200, 5431, 4540, 4766, 4991, 5213, 5433, 5651, 5867, 6080, 6291, 6501, 6708];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).netActualValueByYear.map(x => Math.round(x/10)*10)).to.eql(expected.map(x => Math.round(x/10)*10));
    });
    it('should return true - actualReturnTimeByYear', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();

      var u = new user.User(constants, 3500, true, true, true, true, b);
      u.computeSelfConsumptionRate();
      u.selfProductionRate = 0.3;
      b.user = u;

      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.building = b;
      f.computePVCost();
      f.otherCost=0;
      f.onduleurCost=1500;
      f.computeAnnualMaintenanceCost();
      f.computeCVRate();
      f.annualMaintenanceCost = 0;

      var nYears = 25;
      var currentYear = 2018;
      var expected = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).actualReturnTimeByYear.map(x => Math.round(x))).to.eql(expected);
    });
    it('should return true - marginalActualReturnTimeByYear', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();

      var u = new user.User(constants, 3500, true, true, true, true, b);
      u.computeSelfConsumptionRate();
      u.selfProductionRate = 0.3;
      b.user = u;

      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.building = b;
      //f.computePVCost();
      f.PVCost = 4680;
      f.otherCost = 0;
      f.onduleurCost=1500;
      f.computeAnnualMaintenanceCost();
      f.computeCVRate();
      f.annualMaintenanceCost = 0;

      var nYears = 25;
      var currentYear = 2018;
      var expected = [3.54, 2.61, 2.37, 1.41, 0.42, 0.60, 1.65, 2.73, 3.84, 4.99, 18.82, 20.02, 21.24, 22.46, 6.09, 20.01, 21.23, 22.45, 23.69, 24.95, 26.21, 27.49, 28.78, 30.08, 31.40];
      expect(financial.computeFinancialAmortization(b, f, nYears, currentYear).marginalActualReturnTimeByYear.map(x => Math.round(x*100)/100)).to.eql(expected);
    });
    it('should return true - actualReturnTime', function() {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.PVCost = 8550;
      f.otherCost = 0;
      f.onduleurCost=1500;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).actualReturnTime)).to.be.equal(7);
    });
    it('should return true - netActualValue', function() {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.PVCost = 8550;
      f.otherCost = 0;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).netActualValue)).to.be.equal(5945);
    });
    it('should return true - returnInternalRate', function() {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.PVCost = 8550;
      f.otherCost = 0;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).returnInternalRate*1000)/1000).to.be.equal(0.127);
    });
    it('should return true - modifiedReturnInternalRate', function() {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.PVCost = 8550;
      f.otherCost = 0;
      var balance = [1774, 1798, 1308, 1318, 1329, 1340, 1351, 1362, 1374, 1387, 459, 473, 487, 501, -1503, 531, 547, 563, 579, 597, 614, 632, 651, 670, 690];
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualFinancialAmortization(f, balance, actualReturnTimeByYear, marginalActualReturnTimeByYear).modifiedReturnInternalRate*100)/100).to.be.equal(0.06);
    });
    it('should return true - actualReturnTime', function() {
      var actualReturnTimeByYear = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var marginalActualReturnTimeByYear = [5.18, 4.29, 4.71, 3.82, 2.91, 1.97, 1.00, 0.00, 1.03, 2.09, 9.70, 10.81, 11.93, 13.06, 4.88, 11.41, 12.53, 13.67, 14.82, 15.98, 17.16, 18.34, 19.54, 20.75, 21.97];
      expect(Math.round(financial.computeActualReturnTime(actualReturnTimeByYear, marginalActualReturnTimeByYear))).to.be.equal(7);
    });
    it('should return true - productionPrice', function() {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.PVCost = 8550;
      f.otherCost = 0;
      var nYears = 25;
      var production = 3705;
      var selfConsumptionAmountYear1 = 829;
      var CVAmountYear1 = 945;
      expect(Math.round(financial.computeSimplifiedFinancialAmortization(f, production, selfConsumptionAmountYear1, CVAmountYear1, nYears).productionPrice*10)/10).to.be.equal(0.10);
    });
    it('should return true - simpleReturnTime', function() {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.PVCost = 8550;
      f.otherCost = 0;
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
    it('should return true - getInstallationCost', function() {
      var f = new financial.Financial(constants, 0.03, 85, 0.06, -9999, false, 5, 0.01);
      f.PVCost = 4680;
      f.otherCost = 0;
      expect(financial.getInstallationCost(f)).to.eql(4969);
    });
  });
});


// TODO test sur computeActualPrice
