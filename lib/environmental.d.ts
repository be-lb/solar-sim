import { Building } from './building';
declare class Environmental {
    origin: string;
    constructor(the_origin: string);
}
export interface EnergeticCostFactor {
    [key: string]: number;
}
export interface BreakdownCostFactor {
    [key: string]: number;
}
export interface BreakdownCostFactorByOrigin {
    [key: string]: BreakdownCostFactor;
}
export interface environmentalCosts {
    'energeticCost': number;
    'panels': number;
    'setup': number;
    'inverter': number;
    'transportBE': number;
    'transportEU': number;
    'transportBoat': number;
}
declare const getEnvironmentalCosts: (environmental: Environmental, building: Building) => environmentalCosts;
interface energeticReturn {
    'energeticReturnFactor': number;
    'energeticReturnTime': number;
}
declare const computeEnergeticReturn: (energeticCost: number, production: number, actualProduction: number[]) => energeticReturn;
declare const computeSavedCO2Emissions: (actualProduction: number[]) => number;
declare const sum: (arr: number[]) => number;
export { Environmental };
export { getEnvironmentalCosts, computeEnergeticReturn, computeSavedCO2Emissions, sum };
