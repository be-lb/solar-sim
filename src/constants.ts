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
export const METER_COST = 289; // € TVAC 21%
export const ONDULEUR_COST_FACTOR = 250; // 250€ TVAC6% par kWc
export const ONDULEUR_REPLACEMENT_RATE = 15; // year
export const REDEVANCE_COST = 65; // €
export const INFLATION_RATE = 0.02 // %
export const ELEC_BUYING_PRICE = 0.23;
export const ELEC_INDEX = 0.03;
export const DISCOUNT_RATE = 0.04;
export const CV_RATE_SWITCH_POWER = 5; // kWc
export const CV_RATE_LOW_POWER = 3;
export const CV_RATE_HIGH_POWER = 2.4;
export const CV_TIME = 10;
export const CV_END_OF_COMPENSATION_YEAR = 2020;
export const PRODUCTION_YEARLY_LOSS_INDEX = 0.0005;
export const MAINTENANCE_COST_FACTOR = 0.0075;

/**
*
* roof
*
*/

/**
* Maximal solar productivity for a roof in Bruxelles kWh/m².an
*/
export const MAX_SOLAR_PRODUCTIVITY : number = 1300;

/**
* Inclination (tilt) threshold for flat roof
*/
export const FLAT_ROOF_TILT : number = 0.05;

/**
* Low limit for roof productivity (kWh/kWc.m²)
*/
export const LOW_PRODUCTIVITY_LIMIT: number = 800


/**
* Mapping of the PV yield given the photovoltaic technology (Polycristallin, Monocristallin, Monocristallin high performance).
*/
export const PV_YIELD : PVYieldObject = {
    'poly': 0.13,
    'mono': 0.155,
    'mono_high' : 0.22
};

/**
* Mapping of the PV cost given the photovoltaic technology (Polycristallin, Monocristallin, Monocristallin high performance).
* Price HTVA €
*/
export const PV_COST : PVYieldObject = {
    'poly': 1400/1.06,
    'mono': 1500/1.06,
    'mono_high': 1600/1.06
};


/**
*
* user
*
*/

export const ANNUAL_CONSUMPTION_BASE = 600;
export const WASHING_MACHINE_FACTOR = 600;
export const ELECTRIC_WATER_HEATER_FACTOR = 2336;
export const ELECTRIC_HEATING_FACTOR = 16500;

export const SELF_PRODUCTION : selfProduction = {
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
}


/**
*
* thermic
*
*/

export const THERMIC_INSTALLATION_COST = 6000; /* € */
export const THERMIC_MAINTENANCE_COST = 100; /* € */
export const MAX_LITER_PER_DAY = 210; /* L */
export const MIN_THERMIC_AREA = 5; /* m² */

/**
* Mapping of the external energy supply yield for the ECS given the external energy source
*/
interface HotWaterObjects {
    [key: string]: number;
};

export const HOT_WATER_PRODUCER_YIELD : HotWaterObjects = {
    'gas': 0.70,
    'fuel': 0.55,
    'electric' : 0.95
};

export const HOT_WATER_ENERGY_COST : HotWaterObjects = {
    'gas': 0.080,
    'fuel': 0.081,
    'electric' : 0.267
};

export const HOT_WATER_ENERGY_COST_INDEX : HotWaterObjects = {
    'gas': 0.054,
    'fuel': 0.099,
    'electric' : 0.04
};

/**
* CO2 emissions by kWh of electric energy, in kg/kWh, for different energy source
*/
export const CO2_EMISSIONS_BY_KWH_THERMIC : HotWaterObjects = {
    'gas': 0.201,
    'fuel': 0.263,
    'electric': 0.456 // NB: should be equal to CO2_EMISSIONS_BY_KWH
};

export const THERMIC_PRODUCTION : selfProduction = {
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
}
