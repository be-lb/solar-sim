class Building {
    typology: string;
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

export { Building };
export { getObstacleRatePerTypology };
