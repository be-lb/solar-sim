import * as constants from './constants';

class User {
    selfProductionRate: number = constants.SELF_PRODUCTION_RATE;
    consumptionProfile: number;
    hasWashingMachine: boolean;
    hasElectricWaterHeater: boolean;
    hasElectricHeating: boolean;
    annualElectricityConsumption: number;
    computeAnnualElecConsumption () {
        /**
        * @param hasWashingMachine
        * @param hasElectricWaterHeater
        * @param hasElectricHeating
        * Compute the annual electric consumption, in kWh/year
        */
        return this.annualElectricityConsumption =
        constants.ANNUAL_CONSUMPTION_BASE +
        constants.WASHING_MACHINE_FACTOR * Number(this.hasWashingMachine) +
        constants.ELECTRIC_WATER_HEATER_FACTOR * Number(this.hasElectricWaterHeater) +
        constants.ELECTRIC_HEATING_FACTOR * Number(this.hasElectricHeating)
        ;
    };
};

export { User };


// TODO: selfProductionRate compute?
