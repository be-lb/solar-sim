import {Roof} from './roof';
import {User} from './user';

interface TypologyRateObject {
    [key: string]: number;
};

const TYPOLOGY_RATE : TypologyRateObject = {
    'residential': 0.2,
    'detached': 0.35,
    'industrial': 0.1
};

class Building {
    typology: string;
    obstacleRate: number;
    production: number;
    roofs: Roof[];
    user: User;
    constructor(the_typology: string) {
        this.typology = the_typology;
        this.obstacleRate = this.getObstacleRatePerTypology();
    };
    getObstacleRatePerTypology () {
        if (this.obstacleRate === undefined) {
            return this.obstacleRate = TYPOLOGY_RATE[this.typology];
        } else {
            return this.obstacleRate;
        }
    };
    computeProduction () {
        let production: number = 0;
        for (let r of this.roofs) {
            production = production + r.roofProduction;
        }
        return this.production = production;
    };
};


export { Building };
