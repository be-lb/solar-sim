
const SELF_PRODUCTION_RATE = 0.3;
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
    selfProductionRate: number = SELF_PRODUCTION_RATE;
    computeAnnualElecConsumption () {
        return this.annualElectricityConsumption =
        ANNUAL_CONSUMPTION_BASE +
        WASHING_MACHINE_FACTOR * Number(this.hasWashingMachine) +
        ELECTRIC_WATER_HEATER_FACTOR * Number(this.hasElectricWaterHeater) +
        ELECTRIC_HEATING_FACTOR * Number(this.hasElectricHeating)
        ;
    };
};

export { User };


// TODO: selfProductionRate compute?
