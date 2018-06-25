import {Building} from './building';

class Environmental {
    origin: string;
    constructor(the_origin: string) {
        this.origin = the_origin;
    }
}

/**
* CO2 emissions by kWh of electric energy, in kg/kWh
*/
const CO2_EMISSIONS_BY_KWH = 0.456;

interface EnergeticCostFactor {
    [key: string]: number;
};

/**
* Energetic cost for a photovoltaic installation, by origin of the technology, in kWh/kWc
*/
const ENERGETIC_COST_FACTOR : EnergeticCostFactor = {
    'Belgium': 2500,
    'Europe': 2600,
    'China': 2750
};

interface BreakdownCostFactor {
    [key: string]: number;
};

interface BreakdownCostFactorByOrigin {
    [key: string]: BreakdownCostFactor;
};

/**
* Breaddown of the energetic cost for a photovoltaic installation, by origin of the technology.
*/
const BREAKDOWN_COST_FACTOR : BreakdownCostFactorByOrigin = {
    'Belgium': {'panels': 0.85, 'setup': 0.04, 'inverter': 0.09, 'transportBE': 0.02, 'transportEU': 0, 'transportBoat': 0},
    'Europe': {'panels': 0.81, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.05, 'transportBoat': 0},
    'China': {'panels': 0.77, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.02, 'transportEU': 0.02, 'transportBoat': 0.08},
};

interface environmentalCosts {
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
        energeticCost = energeticCost + r.rawPeakPower * ENERGETIC_COST_FACTOR[origin];
    };
    let panels: number = BREAKDOWN_COST_FACTOR[origin].panels;
    let setup: number = BREAKDOWN_COST_FACTOR[origin].setup;
    let inverter: number = BREAKDOWN_COST_FACTOR[origin].inverter;
    let transportBE: number = BREAKDOWN_COST_FACTOR[origin].transportBE;
    let transportEU: number = BREAKDOWN_COST_FACTOR[origin].transportEU;
    let transportBoat: number = BREAKDOWN_COST_FACTOR[origin].transportBoat;

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
    * Compute the energetic factor and return time of the photovoltaic installation.
    */
    let energeticReturnFactor: number = sum(actualProduction)/energeticCost; //TODO: line 10/energeticCost
    let energeticReturnTime: number = energeticCost/production;


    return {
        'energeticReturnFactor': energeticReturnFactor,
        'energeticReturnTime': energeticReturnTime
    }
}

const computeCO2Emissions = (actualProduction: number[]): number => {
    /**
    * @param actualProduction Actual annual photovoltaic production, in kWh/year
    * Compute the C02 emissions that are saved on the total life of the photovoltaic installation.
    */
    return sum(actualProduction)*CO2_EMISSIONS_BY_KWH;
}

const sum = (arr: number[]): number => {
    /**
    * @param theArray Array of numeric values
    * Sum the elements of a numeric array.
    */
    return arr.reduce((a, b) => a + b, 0)
}

export{ Environmental };
export{ getEnvironmentalCosts, computeEnergeticReturn, computeCO2Emissions, sum };
