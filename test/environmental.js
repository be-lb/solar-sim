var assert = require('assert');
var expect = require('expect.js');
var environmental = require('../lib/environmental');
var building = require('../lib/building');
var roof = require('../lib/roof');
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

describe('environmental', function() {
  describe('Environmental()', function() {
    it('should expose an object', function () {
      var e = new environmental.Environmental();
      expect(e).to.be.a('object');
    });
  });
  describe('Computation', function() {
    it('should expose a function', function () {
      expect(environmental.getEnvironmentalCosts).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.computeEnergeticReturn).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.computeSavedCO2Emissions).to.be.a('function');
    });
    it('should expose a function', function () {
      expect(environmental.sum).to.be.a('function');
    });
    it('should return true - energeticCost', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();
      var e = new environmental.Environmental('Belgium');

      expect(environmental.getEnvironmentalCosts(e, b, constants).energeticCost).to.be.equal(7800);

    });
    it('should return true - panels costs', function() {
       var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
      var r = new roof.Roof(constants, 30, 950, 30, 180, 'poly', b);
      b.roofs = [r];
      b.computeProduction();
      b.computePower();
      var e = new environmental.Environmental('Belgium');

      expect(environmental.getEnvironmentalCosts(e, b, constants).panels).to.be.equal(0.85);
    });
    it('should return true - energeticReturnFactor', function() {
      var energeticCost = 7800;
      var production = 2964;
      var actualProduction = [2964, 2963, 2961, 2960, 2958, 2957, 2955, 2954, 2952, 2951, 2949, 2948, 2946, 2945, 2943, 2942, 2940, 2939, 2937, 2936, 2935, 2933, 2932, 2930, 2929];
      expect(Math.round(environmental.computeEnergeticReturn(energeticCost, production, actualProduction).energeticReturnFactor*10)/10).to.be.equal(9.4);
    });
    it('should return true - energeticReturnTime', function() {
      var energeticCost = 7800;
      var production = 2964;
      var actualProduction = [2964, 2963, 2961, 2960, 2958, 2957, 2955, 2954, 2952, 2951, 2949, 2948, 2946, 2945, 2943, 2942, 2940, 2939, 2937, 2936, 2935, 2933, 2932, 2930, 2929];
      expect(Math.round(environmental.computeEnergeticReturn(energeticCost, production, actualProduction).energeticReturnTime*10)/10).to.be.equal(2.6);
    });
    it('should return true - computeSavedCO2Emissions', function() {
      var actualProduction = [2964, 2963, 2961, 2960, 2958, 2957, 2955, 2954, 2952, 2951, 2949, 2948, 2946, 2945, 2943, 2942, 2940, 2939, 2937, 2936, 2935, 2933, 2932, 2930, 2929];
      expect(Math.round(environmental.computeSavedCO2Emissions(actualProduction, constants))).to.be.equal(33589);
    });
    it('should return true - sum', function() {
      expect(environmental.sum([1,2,3,-1])).to.be.equal(5);
    });
  });
});
