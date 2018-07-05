import {Building} from './building';
import * as constants from './constants';

class Environmental {
    origin: string;
    constructor(the_origin: string) {
        this.origin = the_origin;
    }
}

export interface EnergeticCostFactor {
    [key: string]: number;
};

export interface BreakdownCostFactor {
    [key: string]: number;
};

export interface BreakdownCostFactorByOrigin {
    [key: string]: BreakdownCostFactor;
};

export interface environmentalCosts {
    'energeticCost': number;
    'panels': number;
    'setup': number;
    'inverter': number;
    'transportBE': number;
    'transportEU': number;
    'transportBoat': number;
};

const getEnvironmentalCosts =
    (environmental:Environmental, building: Building): environmentalCosts => {

    /**
    * @param Environmental
    * @param Roof
    * Return some environmental costs imputed to the construction of the photovoltaic installation
    */

    let origin : string = environmental.origin;
    let energeticCost: number = 0;
    for (let r of building.roofs) {
        energeticCost = energeticCost + r.rawPeakPower * constants.ENERGETIC_COST_FACTOR[origin];
    };
    let panels: number = constants.BREAKDOWN_COST_FACTOR[origin].panels;
    let setup: number = constants.BREAKDOWN_COST_FACTOR[origin].setup;
    let inverter: number = constants.BREAKDOWN_COST_FACTOR[origin].inverter;
    let transportBE: number = constants.BREAKDOWN_COST_FACTOR[origin].transportBE;
    let transportEU: number = constants.BREAKDOWN_COST_FACTOR[origin].transportEU;
    let transportBoat: number = constants.BREAKDOWN_COST_FACTOR[origin].transportBoat;

    return {
        'energeticCost': energeticCost,
        'panels': panels,
        'setup': setup,
        'inverter': inverter,
        'transportBE': transportBE,
        'transportEU': transportEU,
        'transportBoat': transportBoat
    }
}

interface energeticReturn {
    'energeticReturnFactor': number;
    'energeticReturnTime': number;
};

const computeEnergeticReturn =
    (energeticCost: number, production: number, actualProduction: number[]): energeticReturn => {
    /**
    * @param energeticCost Energetic cost of the photovoltaic installation, in kWh
    * @param production Annual photovoltaic production, in kWh/year
    * @param actualProduction Actual annual photovoltaic production, in kWh/year
    * Compute the energetic factor and return time (year) of the photovoltaic installation.
    */
    let energeticReturnFactor: number = sum(actualProduction)/energeticCost;
    let energeticReturnTime: number = energeticCost/production;


    return {
        'energeticReturnFactor': energeticReturnFactor,
        'energeticReturnTime': energeticReturnTime
    }
}

const computeCO2Emissions = (actualProduction: number[]): number => {
    /**
    * @param actualProduction Actual annual photovoltaic production, in kWh/year
    * Compute the C02 emissions (kg C02) that are saved on the total life of the photovoltaic installation.
    */
    return sum(actualProduction) * constants.CO2_EMISSIONS_BY_KWH;
}

const sum = (arr: number[]): number => {
    /**
    * @param arr Array of numeric values
    * Sum the elements of a numeric array.
    */
    return arr.reduce((a, b) => a + b, 0)
}

export{ Environmental };
export{ getEnvironmentalCosts, computeEnergeticReturn, computeCO2Emissions, sum };
