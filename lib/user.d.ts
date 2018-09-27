import { Building } from './building';
import { Constants } from './io';
export interface selfProduction {
    [key: string]: any;
}
declare class User {
    private constants;
    selfProductionRate: number;
    consumptionProfile: number;
    hasWashingMachine: boolean;
    hasEnergySobriety: boolean;
    hasChargeSwift: boolean;
    hasPvHeater: boolean;
    hasBattery: boolean;
    annualElectricityConsumption: number;
    building: Building;
    constructor(constants: Constants, annual_consumption: number, energy_sobriety: boolean, charge_swift: boolean, pv_heater: boolean, battery: boolean, b: Building);
    computeAnnualElecConsumption(): number;
    computeSelfConsumptionRate(): number;
}
export { User };
