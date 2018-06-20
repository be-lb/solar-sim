import {Building} from './building';
import {PV} from './pv';

class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    building: Building;
    peakPower: number;
    computeRoofUsableArea () {
        if (this.usableArea === undefined) {
            return this.usableArea =
            this.rawArea * (1 - this.building.getObstacleRatePerTypology());
        } else {
            return this.usableArea;
        }
    };
    computePeakPower (pv:PV) {
        this.computeRoofUsableArea();
        return this.peakPower =
        this.usableArea / (1000 / (1000 * pv.yield) * 1)
        ;
    };
};

export { Roof };
