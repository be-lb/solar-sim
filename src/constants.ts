import {EnergeticCostFactor, BreakdownCostFactorByOrigin} from './environmental';
import {PVYieldObject} from './roof';

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
export const SELF_PRODUCTION_RATE = 0.3;
export const ANNUAL_CONSUMPTION_BASE = 600;
export const WASHING_MACHINE_FACTOR = 600;
export const ELECTRIC_WATER_HEATER_FACTOR = 2300;
export const ELECTRIC_HEATING_FACTOR = 16500;
