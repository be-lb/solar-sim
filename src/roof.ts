import {Building} from './building';

class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    building: Building;
    computeRoofUsableArea () {
        return this.usableArea = this.rawArea * (1 - this.building.getObstacleRatePerTypology());
    };
};

export { Roof };
