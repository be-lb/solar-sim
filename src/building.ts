class Building {
    typology: string;
    // constructor(public typology: string) {
    //     this.typology = typology;
    // }
};

interface TypologyRateObject {
    [key: string]: number;
};

let TypologyRate : TypologyRateObject = {
    'residential': 0.3,
    'detached': 0.35,
    'industrial': 0.1
};

const getObstacleRatePerTypology = (building:Building) => {
    let rate : number = TypologyRate[building.typology];
    return rate;
};

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

export { Building, Roof };
export { computeRoofUsableArea, getObstacleRatePerTypology };
