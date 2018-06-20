import {Roof} from './roof';
import {User} from './user';
import {PV} from './pv';

interface TypologyRateObject {
    [key: string]: number;
};

let TypologyRate : TypologyRateObject = {
    'residential': 0.2,
    'detached': 0.35,
    'industrial': 0.1
};

class Building {
    typology: string;
    productivity: number;
    obstacleRate: number;
    roofs: Roof[];
    pv: PV;
    user: User;
    getObstacleRatePerTypology () {
        if (this.obstacleRate === undefined) {
            return this.obstacleRate = TypologyRate[this.typology];
        } else {
            return this.obstacleRate;
        }
    };
};

export { Building };
