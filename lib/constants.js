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
exports.CV_RATE = 3;
exports.CV_TIME = 10;
exports.CV_END_OF_COMPENSATION_YEAR = 2020;
exports.PRODUCTION_YEARLY_LOSS_INDEX = 0.0005;
exports.FLAT_ROOF_TILT = 0.05;
exports.PV_YIELD = {
    'poly': 0.13,
    'mono': 0.155,
    'mono_high': 0.22
};
exports.SELF_PRODUCTION_RATE = 0.3;
exports.ANNUAL_CONSUMPTION_BASE = 600;
exports.WASHING_MACHINE_FACTOR = 600;
exports.ELECTRIC_WATER_HEATER_FACTOR = 2300;
exports.ELECTRIC_HEATING_FACTOR = 16500;
