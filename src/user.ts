
const ANNUAL_CONSUMPTION_BASE = 600;
const WASHING_MACHINE_FACTOR = 600;
const ELECTRIC_WATER_HEATER_FACTOR = 2300;
const ELECTRIC_HEATING_FACTOR = 16500;

class User {
    category: string;
    consumptionProfile: number;
    hasWashingMachine: boolean;
    hasElectricWaterHeater: boolean;
    hasElectricHeating: boolean;
    annualElectricityConsumption: number;
    selfProductionRate: number;
    computeAnnualElecConsumption () {
        return this.annualElectricityConsumption =
        ANNUAL_CONSUMPTION_BASE +
        WASHING_MACHINE_FACTOR * <any>this.hasWashingMachine +
        ELECTRIC_WATER_HEATER_FACTOR * <any>this.hasElectricWaterHeater +
        ELECTRIC_HEATING_FACTOR * <any>this.hasElectricHeating
        ;
    };
};

export { User };
