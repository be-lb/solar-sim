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
exports.ONDULEUR_COST_FACTOR = 250;
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
exports.MAINTENANCE_COST_FACTOR = 0.0075;
exports.MAX_SOLAR_PRODUCTIVITY = 1300;
exports.FLAT_ROOF_TILT = 5;
exports.LOW_PRODUCTIVITY_LIMIT = 800;
exports.PV_YIELD = {
    'poly': 0.13,
    'mono': 0.155,
    'mono_high': 0.22
};
exports.PV_COST = {
    'poly': 1400 / 1.06,
    'mono': 1500 / 1.06,
    'mono_high': 1600 / 1.06
};
exports.ANNUAL_CONSUMPTION_BASE = 600;
exports.WASHING_MACHINE_FACTOR = 600;
exports.ELECTRIC_WATER_HEATER_FACTOR = 2336;
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
};
exports.THERMIC_INSTALLATION_COST = 6000;
exports.THERMIC_MAINTENANCE_COST = 100;
exports.MAX_LITER_PER_DAY = 210;
exports.MIN_THERMIC_AREA = 5;
;
exports.HOT_WATER_PRODUCER_YIELD = {
    'gas': 0.70,
    'fuel': 0.55,
    'electric': 0.95
};
exports.HOT_WATER_ENERGY_COST = {
    'gas': 0.080,
    'fuel': 0.081,
    'electric': 0.267
};
exports.HOT_WATER_ENERGY_COST_INDEX = {
    'gas': 0.054,
    'fuel': 0.099,
    'electric': 0.04
};
exports.CO2_EMISSIONS_BY_KWH_THERMIC = {
    'gas': 0.201,
    'fuel': 0.263,
    'electric': 0.456
};
exports.THERMIC_PRODUCTION = {
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
        "135": 1368,
        "157.5": 1398,
        "180": 1408,
        "202.5": 1398,
        "225": 1368,
        "247.5": 1321,
        "270": 1262,
    },
    "210": {
        "90": 1364,
        "112.5": 1432,
        "135": 1487,
        "157.5": 1522,
        "180": 1534,
        "202.5": 1522,
        "225": 1487,
        "247.5": 1432,
        "270": 1364,
    }
};
