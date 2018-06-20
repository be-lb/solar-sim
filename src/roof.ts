import {Building, getObstacleRatePerTypology} from './building';

class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    building: Building;
};

const computeRoofUsableArea = (roof : Roof) => {
    let area : number = roof.rawArea*(1-getObstacleRatePerTypology(roof.building));
    return area;
};

export { Roof };
export { computeRoofUsableArea };
