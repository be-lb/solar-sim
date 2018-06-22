import {Roof} from './roof';

class Environmental {
    origin: string;
    constructor(the_origin: string) {
        this.origin = the_origin;
    }
}


interface EnergeticCostFactor {
    [key: string]: number;
};

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

const BREAKDOWN_COST_FACTOR : BreakdownCostFactorByOrigin = {
    'Belgium': {'panels': 0.85, 'setup': 0.04, 'inverter': 0.09, 'transportBE': 0.02, 'transportEU': 0, 'transportBoat': 0},
    'Europe': {'panels': 0.81, 'setup': 0.03, 'inverter': 0.08, 'transportBE': 0.07, 'transportEU': 0.05, 'transportBoat': 0},
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
    (environmental:Environmental, roof: Roof):
    environmentalCosts => {

    let origin : string = environmental.origin;
    let energeticCost: number = roof.rawPeakPower * ENERGETIC_COST_FACTOR[origin]; // TODO; should be defined at the building/user level
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

interface environmentalROI {
    'returnFactor': number;
    'returnTime': number;
};

const computeEnvironmentalROI =
    ():
    environmentalROI => {

    let returnTime: number = 1; //TODO
    let returnFactor: number = 1; //TODO

    return {
        'returnFactor': returnFactor,
        'returnTime': returnTime
    }
}


export{ Environmental };
export{ getEnvironmentalCosts, computeEnvironmentalROI };
