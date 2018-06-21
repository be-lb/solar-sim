import {Building} from './building';
import {PV} from './pv';

class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    building: Building;
    rawPeakPower: number;
    usablePeakPower: number;
    // roofProduction: number;
    computeRoofUsableArea () {
        if (this.usableArea === undefined) {
            return this.usableArea =
            this.rawArea * (1 - this.building.getObstacleRatePerTypology());
        } else {
            return this.usableArea;
        }
    };
    computeRawPeakPower (pv:PV) {
        /**
        * @param rawArea - Raw area for photovoltaic installation (m²)
        * @param pv.setupFactor - Type of mounting of the photovoltaic installation
        * @param pv.yield - Yield of the photovoltaic installation
        * Returns the raw peak power of the roof (kWc)
        */
        console.log(this.rawArea);
        return this.rawPeakPower =
        this.rawArea / (1000 / (1000 * pv.yield) * pv.setupFactor)
        ;
    };
    computeUsablePeakPower (pv:PV) {
        /**
        * @param usableArea - Usable area for photovoltaic installation (m²)
        * @param pv.setupFactor - Type of mounting of the photovoltaic installation
        * @param pv.yield - Yield of the photovoltaic installation
        * Returns the usable peak power of the roof (kWc)
        */
        this.computeRoofUsableArea();
        return this.usablePeakPower =
        this.usableArea / (1000 / (1000 * pv.yield) * pv.setupFactor)
        ;
    };
    // computeRoofProduction () {
    //     if (this.roofProduction === undefined) {
    //         return this.roofProduction = this.rawPeakPower * this.productivity;
    //     } else {
    //         return this.roofProduction;
    //     }
    // };
};

export { Roof };
