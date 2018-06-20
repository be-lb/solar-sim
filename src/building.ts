interface TypologyRateObject {
    [key: string]: number;
};

let TypologyRate : TypologyRateObject = {
    'residential': 0.3,
    'detached': 0.35,
    'industrial': 0.1
};

class Building {
    typology: string;
    obstacleRate: number;
    getObstacleRatePerTypology () {
        return this.obstacleRate = TypologyRate[this.typology];
    };
};

export { Building };
