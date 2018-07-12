"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_POWER = 12;
exports.CO2_EMISSIONS_BY_KWH = 0.456;
exports.ENERGETIC_COST_FACTOR = {
    'Belgium': 2500,
    'Europe': 2600,
    'China': 2750
};
exports.BREAKDOWN_COST_FACTOR = {
    'Belgium': { 'panels': 0.85, 'setup': 0.04, 'inverter': 0.09, 'transportBE': 0.02, 'transportEU': 0, 'transportBoat': 0 },
    'Europe': { 'panels': 0.81, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.05, 'transportBoat': 0 },
    'China': { 'panels': 0.77, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.02, 'transportBoat': 0.08 },
};
exports.METER_COST = 289;
exports.ONDULEUR_COST = 1500;
exports.ONDULEUR_REPLACEMENT_RATE = 15;
exports.REDEVANCE_COST = 65;
exports.INFLATION_RATE = 0.02;
exports.ELEC_BUYING_PRICE = 0.23;
exports.ELEC_INDEX = 0.03;
exports.DISCOUNT_RATE = 0.04;
exports.CV_RATE_SWITCH_POWER = 5;
exports.CV_RATE_LOW_POWER = 3;
exports.CV_RATE_HIGH_POWER = 2.4;
exports.CV_TIME = 10;
exports.CV_END_OF_COMPENSATION_YEAR = 2020;
exports.PRODUCTION_YEARLY_LOSS_INDEX = 0.0005;
exports.MAINTENANCE_YEARLY_COST_INDEX = 0.0075;
exports.FLAT_ROOF_TILT = 0.05;
exports.PV_YIELD = {
    'poly': 0.13,
    'mono': 0.155,
    'mono_high': 0.22
};
exports.ANNUAL_CONSUMPTION_BASE = 600;
exports.WASHING_MACHINE_FACTOR = 600;
exports.ELECTRIC_WATER_HEATER_FACTOR = 2300;
exports.ELECTRIC_HEATING_FACTOR = 16500;
exports.SELF_PRODUCTION = {
    "default": {
        "0.6": 0.25,
        "1": 0.3,
        "1.4": 0.34,
        "1.8": 0.36,
        "2.2": 0.38,
        "2.6": 0.39,
        "3": 0.4,
    },
    "energeticSobriety": {
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
};
