declare class User {
    selfProductionRate: number;
    consumptionProfile: number;
    hasWashingMachine: boolean;
    hasElectricWaterHeater: boolean;
    hasElectricHeating: boolean;
    annualElectricityConsumption: number;
    computeAnnualElecConsumption(): number;
}
export { User };
