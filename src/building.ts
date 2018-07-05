import {Roof} from './roof';
import {User} from './user';
import * as constants from './constants';

export interface TypologyRateObject {
    [key: string]: number;
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
            return this.obstacleRate = constants.TYPOLOGY_RATE[this.typology];
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
        production = production > constants.MAX_PRODUCTION ? production: constants.MAX_PRODUCTION;
        return this.production = production;

    };
};


export { Building };
