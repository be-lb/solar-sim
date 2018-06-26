import {Roof} from './roof';
import {User} from './user';

/**
* Maximum production allowed for a building (12 kWc)
*/
const MAX_PRODUCTION = 12;

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
        /**
        * @param typology - building typology
        * Look-up function for selecting the obstacle rate based on the building typology.
        */
        if (this.obstacleRate === undefined) {
            return this.obstacleRate = TYPOLOGY_RATE[this.typology];
        } else {
            return this.obstacleRate;
        }
    };
    computeProduction () {
        /**
        * Compute the total potential production of the building (kWh). Cannot exceed MAX_PRODUCTION.
        */
        let production: number = 0;
        for (let r of this.roofs) {
            production = production + r.roofProduction;
        }
        production = production > MAX_PRODUCTION ? production: MAX_PRODUCTION;
        return this.production = production;

    };
};


export { Building };
