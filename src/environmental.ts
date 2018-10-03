import { Building } from './building';
import { Constants, CostFactorOrigin } from './io';

class Environmental {
    origin: CostFactorOrigin;

    constructor(origin: CostFactorOrigin) {
        this.origin = origin;
    }
}


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
    (environmental: Environmental, building: Building, constants: Constants): environmentalCosts => {

        /**
        * @param Environmental
        * @param Roof
        * Return some environmental costs imputed to the construction of the photovoltaic installation
        */

        let origin = environmental.origin;
        let energeticCost: number = building.power * constants.energetic_cost_factor[origin];
        let panels: number = constants.breakdown_cost_factor[origin].panels;
        let setup: number = constants.breakdown_cost_factor[origin].setup;
        let inverter: number = constants.breakdown_cost_factor[origin].inverter;
        let transportBE: number = constants.breakdown_cost_factor[origin].transportBE;
        let transportEU: number = constants.breakdown_cost_factor[origin].transportEU;
        let transportBoat: number = constants.breakdown_cost_factor[origin].transportBoat;

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
        const energeticReturnFactor: number = sum(actualProduction) / energeticCost;
        const energeticReturnTime: number = energeticCost / production;


        return {
            energeticReturnFactor: energeticReturnFactor,
            energeticReturnTime: energeticReturnTime,
        }
    };

const computeSavedCO2Emissions = (actualProduction: number[], constants: Constants): number => {
    /**
    * @param actualProduction Actual annual photovoltaic production, in kWh/year
    * Compute the C02 emissions (kg C02) that are saved on the total life of the photovoltaic installation.
    */
    return sum(actualProduction) * constants.co2_emissions_by_kwh;
};

const sum = (arr: number[]): number => {
    /**
    * @param arr Array of numeric values
    * Sum the elements of a numeric array.
    */
    return arr.reduce((a, b) => a + b, 0)
};

export { Environmental };
export { getEnvironmentalCosts, computeEnergeticReturn, computeSavedCO2Emissions, sum };
