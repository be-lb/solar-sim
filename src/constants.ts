import {TypologyRateObject} from './building';
import {EnergeticCostFactor, BreakdownCostFactorByOrigin} from './environmental';
import {PVSetupObject} from './roof';

/**
*
* building
*
*/

/**
* Maximum production allowed for a building (12 kWc)
*/
export const MAX_PRODUCTION = 12;

/**
* Obstacle rate depending on the typology
*/
export const TYPOLOGY_RATE : TypologyRateObject = {
    'residential': 0.2,
    'detached': 0.35,
    'industrial': 0.1
};

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
export const ELEC_SELLING_PRICE = 0.03;
export const ELEC_INDEX = 0.03;
export const DISCOUNT_RATE = 0.04;
export const CV_PRICE = 85;
export const CV_RATE = 3;
export const CV_TIME = 10;

/**
*
* roof
*
*/
export const PV_YIELD = 0.13;
export const PRODUCTION_YEARLY_LOSS_INDEX = 0.0005;

/**
* Mapping of the setup factor given the photovoltaic setup.
*/
export const PV_SETUP : PVSetupObject = {
    'default': 1,
    'flat_roof': 0.5
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
