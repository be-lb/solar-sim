import {Roof} from './roof';
import {User} from './user';
import * as debug from 'debug';

const logger = debug('solar-sim:building');

class Building {
    obstacleRate: number;
    production: number;
    power: number;
    pvArea: number;
    maxPvArea: number;
    roofs: Roof[];
    user: User;
    MAX_POWER: number;
    MAX_SOLAR_PRODUCTIVITY: number;
    constructor(
        the_obstacle_rate: number,
        the_MAX_POWER: number,
        the_MAX_SOLAR_PRODUCTIVITY: number
    ) {
        this.obstacleRate = the_obstacle_rate;
        this.roofs = [];
        this.MAX_POWER = the_MAX_POWER;
        this.MAX_SOLAR_PRODUCTIVITY = the_MAX_SOLAR_PRODUCTIVITY;
    };
    computeProduction () {
        /**
        * Compute the total potential production of the building (kWh). Cannot exceed a maximal production.
        */
        let production: number = 0;
        for (let r of this.roofs) {
            production = production + r.roofProduction;
        }

        /* Set a maximal value for the building production */
        if (production > this.MAX_POWER * this.MAX_SOLAR_PRODUCTIVITY) {
            logger(`Warning! Building production too large: ${production}`);
            production = this.MAX_POWER * this.MAX_SOLAR_PRODUCTIVITY;
        }

        return this.production = production;
    };
    computePower () {
        /**
        * Compute the total power of the building (kWc).
        */
        let power: number = 0;
        for (let r of this.roofs) {
            power = power + r.usablePeakPower;
        }
        if (power > this.MAX_POWER) {
            optimizeRoofPowers(this, power);
            return this.power = this.MAX_POWER;
        } else {
            return this.power = power;
        }
    };
    computePVArea () {
        /**
        * Compute the total photovoltaic area of the building (m²).
        */
        let computedPvArea: number = 0;
        for (let r of this.roofs) {
            computedPvArea = computedPvArea + r.usableArea;
        }
        if (this.pvArea === -9999) {
            return this.pvArea = computedPvArea;
        } else { // this.pvArea was modified by the user
            if (this.pvArea < computedPvArea){
                let area: number = optimizeRoofAreas(this, computedPvArea);
                return this.pvArea = area;
            } else {
                return this.pvArea;
            }
        }
    };
    computeMaxPvArea () {
        /**
        * Computed the max photovoltaic area (m²) that is installable given the power of the building.
        * This is equal to `pvArea` unless the MAX_POWER (e.g., 12 kWc) was overpassed.
        */
        let maxPvArea: number = 0;
        for (let r of this.roofs) {
            maxPvArea = maxPvArea + r.usablePeakPower * (1000 / (1000 * r.yield) * r.setupFactor);
        }
        return this.maxPvArea = maxPvArea;
    };
};

const MAX_ITERATION_WHILE: number = 500;
const optimizeRoofAreas = (b: Building, actualPvArea: number): number  => {
    /**
    * Optimize roof area as a function of their productivity. This function is called
    * whenever the user enter a custom area value.
    */
    let inputArea: number = b.pvArea;
    let computedPvArea: number = actualPvArea;

    let roofProductivities: number[] = [];
    for (let r of b.roofs) {
        roofProductivities.push(r.productivity);
    }
    let sortRoofProductivities: number[] = roofProductivities.sort((a, b) => b - a);

    let cpt: number = 0;
    while (inputArea < computedPvArea && cpt < b.roofs.length && cpt < MAX_ITERATION_WHILE) {

        let deltaArea: number = computedPvArea - inputArea;
        // select the roof by increasing productivity
        for (let r of b.roofs) {
            if (r.productivity === sortRoofProductivities[cpt]) {
                r.usableArea = Math.max((r.usableArea - deltaArea),0);
            }
        }
        computedPvArea = 0;
        for (let r of b.roofs) {
            computedPvArea = computedPvArea + r.usableArea;
        }
        cpt++;
    }

    // Update power and production of all roofs
    for (let r of b.roofs) {
        r.computeUsablePeakPower();
        r.computeRoofProduction();
    }

    return computedPvArea;
}


const optimizeRoofPowers = (b: Building, actualPower: number): void => {
    /**
    * Optimize roof power as a function of their productivity. This function is called
    * when the MAX_POWER is reached.
    */

    let computedPower: number = actualPower;
    let roofProductivities: number[] = [];
    for (let r of b.roofs) {
        roofProductivities.push(r.productivity);
    }
    let sortRoofProductivities: number[] = roofProductivities.sort((a, b) => b - a);

    let cpt: number = 0;
    while (b.MAX_POWER < computedPower && cpt < b.roofs.length && cpt < MAX_ITERATION_WHILE) {

        let deltaPower: number = computedPower - b.MAX_POWER;

        // adapt the power of the roof [cpt]
        for (let r of b.roofs) {
            if (r.productivity === sortRoofProductivities[cpt]) {

                // Avoid having all roof rejected because of too high power
                if (cpt === 1){
                    r.usablePeakPower = Math.max((r.usablePeakPower - deltaPower), b.MAX_POWER);
                } else {
                    r.usablePeakPower = Math.max((r.usablePeakPower - deltaPower), 0);
                }
            }
        }
        // update the building power (= sum of all roof powers)
        computedPower = 0;
        for (let r of b.roofs) {
            computedPower = computedPower + r.usablePeakPower;
        }
        cpt++;
    }

    // Update production of all roofs
    for (let r of b.roofs) {
        r.computeRoofProduction();
    }

};


export { Building };
