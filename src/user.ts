import { Building } from './building';
import * as debug from 'debug';
import { Constants, SelfProductionChoice, SelfProductionValueKey } from './io';


const logger = debug('solar-sim:user');

export interface selfProduction {
    [key: string]: any;
};

class User {
    selfProductionRate: number;
    consumptionProfile: number;
    hasWashingMachine: boolean;
    hasEnergySobriety: boolean;
    hasChargeSwift: boolean;
    hasPvHeater: boolean;
    hasBattery: boolean;
    annualElectricityConsumption: number;
    baseAnnualElectricityConsumption: number;
    building: Building;
    constructor(
        private constants: Constants,
        annual_consumption: number, energy_sobriety: boolean, charge_swift: boolean, pv_heater: boolean, battery: boolean, b: Building) {
        this.annualElectricityConsumption = annual_consumption;
        this.baseAnnualElectricityConsumption = annual_consumption;
        this.hasEnergySobriety = energy_sobriety;
        this.hasChargeSwift = charge_swift;
        this.hasPvHeater = pv_heater;
        this.hasBattery = battery;
        this.building = b;
    }
    computeAnnualElecConsumption() {
        /**
        * Compute the annual electric consumption, in kWh/year
        */
        let annualElectricityConsumption: number = this.annualElectricityConsumption;
        if (this.hasEnergySobriety) {
            annualElectricityConsumption = annualElectricityConsumption * this.constants.energy_sobriety_factor;
        }
        if (this.hasPvHeater) {
            annualElectricityConsumption = annualElectricityConsumption +
            Math.max(this.constants.electric_water_heater_min_consumption, annualElectricityConsumption * (1 - this.constants.electric_water_heater_factor));
        }
        return this.annualElectricityConsumption = annualElectricityConsumption;
    };
    computeSelfConsumptionRate() {
        /**
        * @param hasEnergySobriety
        * @param hasChargeSwift
        * @param hasPvHeater
        * @param hasBattery
        * Compute the self consumption rate
        */

        let userChoiceKey: SelfProductionChoice;
        if (this.hasBattery) {
            userChoiceKey = 'battery';
        } else {
            if (this.hasPvHeater) {
                userChoiceKey = 'pvHeater';
            } else {
                if (this.hasChargeSwift) {
                    userChoiceKey = 'chargeShift';
                } else {
                    if (this.hasEnergySobriety) {
                        userChoiceKey = 'energySobriety';
                    } else {
                        userChoiceKey = 'default';
                    }
                }
            }
        }

        let keys = Object.keys(this.constants.self_production['default']).map(x => x as SelfProductionValueKey);
        // Compute the ratio based on the baseAnnualElectricityConsumption
        let ratio: number = this.building.production / this.baseAnnualElectricityConsumption;
        let diff: number[] = keys.map(x => Math.abs(Number(x) - ratio));
        let ratioKey = keys[0];
        for (let d of diff) {
            if (d === Math.min(...diff)) {
                ratioKey = keys[diff.indexOf(d)];
            }
        }

        if (userChoiceKey !== <string>'battery' && userChoiceKey !== <string>'pvHeater' && userChoiceKey !== <string>'chargeShift' && userChoiceKey !== <string>'energySobriety' && userChoiceKey !== <string>'default') {

            logger(`Error in the selfProduction rate selection: ${userChoiceKey}`);
            userChoiceKey = 'default';
        }

        let selfProductionRate = this.constants.self_production[userChoiceKey][ratioKey];
        selfProductionRate = selfProductionRate === undefined ? 0.35 : selfProductionRate; // in case there is a problem

        return this.selfProductionRate = selfProductionRate;
    };
};

export { User };
