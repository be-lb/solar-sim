 /*jshint esversion: 6 */

var assert = require('assert');
var expect = require('expect.js');
var thermic = require('../lib/thermic');
var building = require('../lib/building');
var roof = require('../lib/roof');
var financial = require('../lib/financial');
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

describe('Thermic', function() {
  describe('Thermic()', function() {
    it('should expose an object', function () {
      var t = new thermic.Thermic(constants, 5, 30, undefined, 'electric', -9999, -9999, 3, 2500, 0.06);
      expect(t).to.be.a('object');
    });
    it('should expose a function', function () {
      var t = new thermic.Thermic(constants, 5, 30, undefined, 'electric', -9999, -9999, 3, 2500, 0.06);
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
      var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      expect(thermic.getAzimuthBestRoof(constants, b)).to.be.equal(180);
    });
  });
  describe('computeBalances()', function() {
    it('should return true', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(constants, 5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var f = new financial.Financial(constants, -9999, -9999, 0.06, -9999, false, 3, 0.018);
      var nYears = 25;

      var expected = [-4358, -4760, -5262, -5664, -6066, -6563, -6965, -7367, -7858, -8260, -8662, -9148, -9550, -9952, -10433, -10835, -11237, -11714, -12116, -12518, -12991, -13393, -13795, -14263, -14665];
      expect(thermic.computeBalances(t,f,nYears).VANminusConsoWithSolar.map(x => Math.round(x/100)*100)).to.eql(expected.map(x => Math.round(x/100)*100));
    });
    it('should return true', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(constants, 5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var f = new financial.Financial(constants, -9999, -9999, 0.06, -9999, false, 3, 0.018);
      var nYears = 25;

      var expected = [-715, -1429, -2144, -2859, -3573, -4288, -5003, -5717, -6432, -7147, -7861, -8576, -9291, -10005, -10720, -11435, -12149, -12864, -13579, -14293, -15008, -15723, -16437, -17152, -17867];
      expect(thermic.computeBalances(t,f,nYears).VANminusConsoWithoutSolar.map(x => Math.round(x/100)*100)).to.eql(expected.map(x => Math.round(x/100)*100));
    });
  });
  describe('computeThermicGain = 4018 + grant', function() {
    it('should return true', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(constants, 5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var nYears = 10;

      var expected = 4018 + t.grant;
      expect(Math.round(thermic.computeThermicGain(t,nYears))).to.be.equal(expected);
    });
  });
  describe('computeActualReturnTimeThermic = 13.8', function() {
    it('should return true', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(constants, 5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var f = new financial.Financial(constants, -9999, -9999, 0.06, -9999, false, 3, 0.018);
      var nYears = 25;

      var expected = 13.8;
      expect(Math.round(thermic.computeActualReturnTimeThermic(t,f,nYears)*10)/10).to.be.equal(expected);
    });
  });
  describe('computeProductionPrices()', function() {
    it('should return true', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(constants, 5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var nYears = 25;

      var expected = 0.13;
      expect(Math.round(thermic.computeProductionPrices(t,nYears).productionPriceWithSubsidies*100)/100).to.be.equal(expected);
    });
    it('should return true', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 110, 'poly', b);
      b.roofs = [r];
      var t = new thermic.Thermic(constants, 5, 30, 150, 'electric', -9999, -9999, 3, 2500, 0.06);
      t.computeCost();
      t.computeAnnualMaintenanceCost();
      t.building = b;
      t.computeSolarProduction();
      t.computePumpConsumption();
      var nYears = 25;

      var expected = 0.21;
      expect(Math.round(thermic.computeProductionPrices(t,nYears).productionPriceWithoutSubsidies*100)/100).to.be.equal(expected);
    });
  });
});
