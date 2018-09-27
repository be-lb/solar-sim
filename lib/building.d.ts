import { Roof } from './roof';
import { User } from './user';
declare class Building {
    obstacleRate: number;
    production: number;
    power: number;
    pvArea: number;
    maxPvArea: number;
    roofs: Roof[];
    user: User;
    MAX_POWER: number;
    MAX_SOLAR_PRODUCTIVITY: number;
    constructor(the_obstacle_rate: number, the_MAX_POWER: number, the_MAX_SOLAR_PRODUCTIVITY: number);
    computeProduction(): number;
    computePower(): number;
    computePVArea(): number;
    computeMaxPvArea(): number;
}
export { Building };
