export interface selfProduction {
    [key: string]: any;
}
declare class User {
    selfProductionRate: number;
    consumptionProfile: number;
    hasWashingMachine: boolean;
    hasElectricWaterHeater: boolean;
    hasElectricHeating: boolean;
    annualElectricityConsumption: number;
    computeAnnualElecConsumption(): number;
    computeSelfConsumptionRate(): number;
}
export { User };
