//import * as constants from './constants';
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
    constructor(energy_sobriety: boolean, charge_swift: boolean, pv_heater: boolean, battery: boolean, b: Building) {
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
        return this.annualElectricityConsumption =
        3500 // TODO
        ;
    };
    computeSelfConsumptionRate () {
        /**
        * @param hasEnergySobriety
        * @param hasChargeSwift
        * @param hasPvHeater
        * @param hasBattery
        * Compute the self consumption rate
        */
        //
        // let userChoice: string;
        // if (this.hasBattery){
        //     userChoice = 'battery';
        // } else {
        //     if (this.hasPvHeater) {
        //         userChoice = 'pvHeater';
        //     } else {
        //         if (this.hasChargeSwift) {
        //             userChoice = 'chargeShift';
        //         } else {
        //             if (this.hasEnergySobriety) {
        //                 userChoice = 'energySobriety';
        //             } else {
        //                 userChoice = 'default';
        //             }
        //         }
        //     }
        // }

        // let keys : number[] = Object.keys(constants.SELF_PRODUCTION['default']).map(x => Number(x));
        // let ratio: number = this.building.production/this.annualElectricityConsumption;
        //
        // let diff: number[] = keys.map(x => Math.abs(x - ratio));
        // //let autonomy: number = diff.findIndex(x => diff.map(x => x === Math.min(...diff)))

        //let selfProductionRate = constants.SELF_PRODUCTION[userChoice][autonomy];
        //console.log(selfProductionRate);
        return this.selfProductionRate = 0.3;
    };
};

export { User };
