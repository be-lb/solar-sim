var assert = require('assert');
var expect = require('expect.js');
var user = require('../lib/user');
var building = require('../lib/building');
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
    elec_selling_price: 0.03,
    cv_price: 85,
    cv_time: 10,
    cv_end_of_compensation_year: 2020,
    production_yearly_loss_index: 0.0005,
    maintenance_cost_factor: 0.0075,
    max_solar_productivity: 900,
    max_solar_irradiance: 1313,
    medium_solar_productivity: 800.25,
    flat_roof_tilt: 5,
    low_productivity_limit: 600.5,
    energy_sobriety_factor: 0.8,
    electric_water_heater_factor: 1.4,
    electric_water_heater_min_consumption: 1000,
    electric_heating_factor: 16500,
    thermic_installation_cost: 6000,
    thermic_maintenance_cost: 100,
    max_liter_per_day: 210,
    min_thermic_area: 5,
    cv_rate_classes: [
        {
            'lower_limit': 0,
            'upper_limit': 5,
            'cv_rate': 2.4,
        },
        {
            'lower_limit': 5,
            'upper_limit': 9999999999,
            'cv_rate': 1.8,
        }
    ],
    obstacle_default_rate: 0.177,
    obstacle: {
        chimneySmoke: 0.8719,
        velux: 1.409,
        dormerWindow: 5.339,
        flatRoofWindow: 4.192,
        terraceInUse: 26.09,
        lift: 10.93,
        existingSolarPannel: 36.05,
    },
    lost_space_rate: 0.15,
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
        'electric': 0.456
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

describe('User', function() {
  describe('User()', function() {
    it('should expose an object', function () {
         var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
        var u = new user.User(constants, 3500, true, true, true, true, b);
        expect(u).to.be.a('object');
    });
    it('should expose a function', function () {
         var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
        var u = new user.User(constants, 3500, true, true, true, true, b);
        expect(u.computeAnnualElecConsumption).to.be.a('function');
    });
    it('should expose a function', function () {
         var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
        var u = new user.User(constants, 3500, true, true, true, true, b);
        expect(u.computeSelfConsumptionRate).to.be.a('function');
    });
  });
  describe('u.computeAnnualElecConsumption() == 2036', function() {
    it('should return true', function() {
         var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
        var u = new user.User(constants, 2036, false, false, false, false, b);
        expect(u.computeAnnualElecConsumption()).to.be.equal(2036);
    });
  });
  describe('u.computeAnnualElecConsumption() == 3036 (with pv heater)', function() {
    it('should return true', function() {
         var b = new building.Building(0.2, constants.max_power, constants.max_solar_productivity);
        var u = new user.User(constants, 2036, false, false, true, false, b);
        expect(u.computeAnnualElecConsumption()).to.be.equal(3036);
    });
  });
});
