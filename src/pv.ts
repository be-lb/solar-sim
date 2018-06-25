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
    technology: string;
    setup: string;
    setupFactor: number;
    yield: number = PV_YIELD;
    production: number;
    productionYearlyLossIndex: number = PRODUCTION_YEARLY_LOSS_INDEX;
    building: Building;
    constructor(the_setup: string) {
        this.setup = the_setup;
        this.setupFactor = this.getSetupFactor();
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
            let power = r.computeRawPeakPower(this);
            // TODO: check with APERE why use the raw peak power here.
            production = production + power * r.productivity;
        }
        return this.production = production;
    }
};

export { PV };
