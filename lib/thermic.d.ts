import { Financial } from './financial';
import { Building } from './building';
declare class Thermic {
    householdPerson: number;
    literByPersonByDay: number;
    hotWaterProducer: string;
    cost: number;
    annualMaintenanceCost: number;
    maintenanceRate: number;
    grant: number;
    VATrate: number;
    literByDay: number;
    producerYield: number;
    netDemand: number;
    hotWaterEnergyCost: number;
    hotWaterEnergyCostIndex: number;
    solarProduction: number;
    pumpConsumption: number;
    building: Building;
    constructor(the_household_person: number, the_liter_by_person_by_day: number, the_liter_by_day: number, the_hot_water_producer: string, the_cost: number, the_annual_maintenance_cost: number, the_maintenance_rate: number, the_grant: number, the_VAT_rate: number);
    computeCost(): number;
    computeAnnualMaintenanceCost(): number;
    computeLiterByDay(): number;
    computeProducerYield(): number;
    computeNetDemand(): number;
    computeHotWaterEnergyCost(): number;
    computeHotWaterEnergyCostIndex(): number;
    computeSolarProduction(): number;
    computePumpConsumption(): number;
}
declare const getAzimuthBestRoof: (b: Building) => number;
interface Balances {
    [key: string]: number[];
}
declare const computeBalances: (t: Thermic, fin: Financial, nYears: number) => Balances;
declare const computeThermicGain: (t: Thermic, nYears: number) => number;
declare const computeThermicEnvironmentalGain: (t: Thermic, nYears: number) => number;
declare const computeActualReturnTimeThermic: (t: Thermic, fin: Financial, nYears: number) => number;
interface productionPrices {
    [key: string]: number;
}
declare const computeProductionPrices: (t: Thermic, nYears: number) => productionPrices;
export { Thermic, getAzimuthBestRoof, computeBalances, computeThermicGain, computeThermicEnvironmentalGain, computeActualReturnTimeThermic, computeProductionPrices };
