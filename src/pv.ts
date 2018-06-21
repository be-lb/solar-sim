import {Building} from './building';

const PV_YIELD = 0.13;
const PRODUCTION_YEARLY_LOSS_INDEX = 0.0005;

interface PVSetupObject {
    [key: string]: number;
};

const PV_SETUP : PVSetupObject = {
    'default': 1,
    'flat_roof': 0.5
};

class PV {
    peakPower: number;
    technology: string;
    setup: string;
    setupFactor: number;
    yield: number;
    annualProduction: number;
    productionYearlyLossIndex: number;
    building: Building;
    constructor() {
        this.yield = PV_YIELD;
        this.productionYearlyLossIndex = PRODUCTION_YEARLY_LOSS_INDEX;
    }
    getSetupFactor () {
        if (this.setupFactor === undefined) {
            return this.setupFactor = PV_SETUP[this.setup];
        } else {
            return this.setupFactor;
        }
    };
    computeProduction () {
        let production: number = 0;
        for (let r of this.building.roofs) {
            this.setupFactor = this.getSetupFactor();
            let power = r.computePeakPower(this);
            production = production + power * r.productivity;
        }
        return this.annualProduction = production;
    }
};

export { PV };
