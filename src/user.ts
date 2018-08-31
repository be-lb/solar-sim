import * as constants from './constants';
import {Building} from './building';

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
    building: Building;
    constructor(annual_consumption: number, energy_sobriety: boolean, charge_swift: boolean, pv_heater: boolean, battery: boolean, b: Building) {
        this.annualElectricityConsumption = annual_consumption;
        this.hasEnergySobriety = energy_sobriety;
        this.hasChargeSwift = charge_swift;
        this.hasPvHeater = pv_heater;
        this.hasBattery = battery;
        this.building = b;
    }
    computeAnnualElecConsumption () {
        /**
        * Compute the annual electric consumption, in kWh/year
        */
        let annualElectricityConsumption: number = this.annualElectricityConsumption;
        if (annualElectricityConsumption === 2036) { // default value
            if (this.hasPvHeater) {
                annualElectricityConsumption = annualElectricityConsumption + constants.ELECTRIC_WATER_HEATER_FACTOR;
            }
        }
        return this.annualElectricityConsumption = annualElectricityConsumption;
    };
    computeSelfConsumptionRate () {
        /**
        * @param hasEnergySobriety
        * @param hasChargeSwift
        * @param hasPvHeater
        * @param hasBattery
        * Compute the self consumption rate
        */

        let userChoiceKey: string;
        if (this.hasBattery){
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

        let keys : number[] = Object.keys(constants.SELF_PRODUCTION['default']).map(x => Number(x));
        let ratio: number = this.building.production/this.annualElectricityConsumption;
        let diff: number[] = keys.map(x => Math.abs(x - ratio));
        let ratioKey: number = -1;
        for (let d of diff) {
            if (d === Math.min(...diff)) {
                ratioKey = keys[diff.indexOf(d)];
            }
        }

        if (userChoiceKey !== <string>'battery' || userChoiceKey !== <string>'pvHeater' || userChoiceKey != <string>'chargeShift' || userChoiceKey != <string>'energySobriety' || userChoiceKey != <string>'default'){
            userChoiceKey = 'default';
            console.log('Error in the selfProduction rate selection!')
        }

        let selfProductionRate = constants.SELF_PRODUCTION[userChoiceKey][ratioKey];
        selfProductionRate = selfProductionRate === undefined ? 0.35 : selfProductionRate; // in case there is a problem

        return this.selfProductionRate = selfProductionRate;
    };
};

export { User };
