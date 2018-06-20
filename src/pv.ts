import {Building} from './building';

const PV_YIELD = 0.13;

class PV {
    peakPower: number;
    technology: string;
    yield: number;
    annualProduction: number;
    building: Building;
    constructor() {
        this.yield = PV_YIELD;
    }
    computeProduction() {
        let production: number = 0;
        for (let r of this.building.roofs) {
            let power = r.computePeakPower(this);
            production = production + power * r.productivity;
        }
        return this.annualProduction = production;
    }
};

export { PV };
