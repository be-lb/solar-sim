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
        /**
        * @param usableArea - Suitable area for photovoltaic installation (m²)
        * @param pv.setupFactor - Type of mounting of the photovoltaic installation
        * @param pv.yield - Yield of the photovoltaic installation
        * Returns the peak power of the roof (kWc)
        */
        this.computeRoofUsableArea();
        return this.peakPower =
        this.usableArea / (1000 / (1000 * pv.yield) * pv.setupFactor)
        ;
    };
};

export { Roof };
