import { Roof } from './roof';
import { User } from './user';
export interface TypologyRateObject {
    [key: string]: number;
}
declare class Building {
    typology: string;
    obstacleRate: number;
    production: number;
    power: number;
    pvArea: number;
    roofs: Roof[];
    user: User;
    constructor(the_typology: string);
    getObstacleRatePerTypology(): number;
    computeProduction(): number;
    computePower(): number;
    computePVArea(): number;
}
export { Building };
