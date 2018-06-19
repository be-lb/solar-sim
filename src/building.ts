class Building {
    typology: string;
    // constructor(public typology: string) {
    //     this.typology = typology;
    // }
}

class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    building: Building;
}

const getObstacleRatePerTypology = (building:Building) => {
    let rate: number = 0.25;
    console.log(building);
    // switch (building.typology) {
    //     case 'residential':
    //         rate = 0.3;
    //     break;
    //     case 'detached':
    //         rate = 0.35;
    //     break;
    //     case 'industrial':
    //         rate = 0.1;
    //     break;
    // }
    return rate;
}

const computeRoofUsableArea = (roof : Roof) => {
    return roof.rawArea*(1-getObstacleRatePerTypology(roof.building));
}

export { Building, Roof };
export { computeRoofUsableArea };
