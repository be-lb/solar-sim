import { Building } from './building';
export interface selfProduction {
    [key: string]: any;
}
declare class User {
    selfProductionRate: number;
    consumptionProfile: number;
    hasWashingMachine: boolean;
    hasEnergySobriety: boolean;
    hasChargeSwift: boolean;
    hasPvHeater: boolean;
    hasBattery: boolean;
    annualElectricityConsumption: number;
    building: Building;
    constructor(annual_consumption: number, energy_sobriety: boolean, charge_swift: boolean, pv_heater: boolean, battery: boolean, b: Building);
    computeAnnualElecConsumption(): number;
    computeSelfConsumptionRate(): any;
}
export { User };
