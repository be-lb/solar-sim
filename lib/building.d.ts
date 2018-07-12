import { Roof } from './roof';
import { User } from './user';
declare class Building {
    obstacleRate: number;
    production: number;
    power: number;
    pvArea: number;
    roofs: Roof[];
    user: User;
    constructor(the_obstacle_rate: number);
    computeProduction(): number;
    computePower(): number;
    computePVArea(): number;
}
export { Building };