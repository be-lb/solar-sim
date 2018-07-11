import {EnergeticCostFactor, BreakdownCostFactorByOrigin} from './environmental';
import {PVYieldObject} from './roof';
import {selfProduction} from './user';

/**
*
* building
*
*/

/**
* Maximum production allowed for a building (12 kWc)
*/
export const MAX_POWER = 12;

/**
* Obstacle rate depending on the typology
*/
// export const TYPOLOGY_RATE : TypologyRateObject = {
//     'closed': 0.2,
//     'detached': 0.2,
//     'half-open': 0.2,
//     'apartments': 0.2,
//     'administrative': 0.2,
//     'collective': 0.2,
//     'industrial': 0.2,
// };


/**
*
* environmental
*
*/

/**
* CO2 emissions by kWh of electric energy, in kg/kWh
*/
export const CO2_EMISSIONS_BY_KWH = 0.456;

/**
* Energetic cost for a photovoltaic installation, by origin of the technology, in kWh/kWc
*/
export const ENERGETIC_COST_FACTOR : EnergeticCostFactor = {
    'Belgium': 2500,
    'Europe': 2600,
    'China': 2750
};

/**
* Breakdown of the energetic cost for a photovoltaic installation, by origin of the technology.
*/
export const BREAKDOWN_COST_FACTOR : BreakdownCostFactorByOrigin = {
    'Belgium': {'panels': 0.85, 'setup': 0.04, 'inverter': 0.09, 'transportBE': 0.02, 'transportEU': 0, 'transportBoat': 0},
    'Europe': {'panels': 0.81, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.05, 'transportBoat': 0},
    'China': {'panels': 0.77, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.02, 'transportBoat': 0.08},
};

/**
*
* financial
*
*/
export const METER_COST = 289;
export const ONDULEUR_COST = 1500;
export const ONDULEUR_REPLACEMENT_RATE = 15; // year
export const REDEVANCE_COST = 65; // €
export const INFLATION_RATE = 0.02 // %
export const ELEC_BUYING_PRICE = 0.23;
export const ELEC_INDEX = 0.03;
export const DISCOUNT_RATE = 0.04;
export const CV_RATE = 3;
export const CV_TIME = 10;
export const CV_END_OF_COMPENSATION_YEAR = 2020;
export const PRODUCTION_YEARLY_LOSS_INDEX = 0.0005;
export const MAINTENANCE_YEARLY_COST_INDEX = 0.0075;

/**
*
* roof
*
*/

/**
* Inclination (tilt) threshold for flat roof
*/
export const FLAT_ROOF_TILT : number = 0.05;


/**
* Mapping of the PV yield given the photovoltaic technology (Polycristallin, Monocristallin, Monocristallin high performance).
*/
export const PV_YIELD : PVYieldObject = {
    'poly': 0.13,
    'mono': 0.155,
    'mono_high' : 0.22
};

/**
*
* user
*
*/

export const ANNUAL_CONSUMPTION_BASE = 600;
export const WASHING_MACHINE_FACTOR = 600;
export const ELECTRIC_WATER_HEATER_FACTOR = 2300;
export const ELECTRIC_HEATING_FACTOR = 16500;

export const SELF_PRODUCTION : selfProduction = {
    "initial": {
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
}
