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
    power: number;
    pvArea: number;
    roofs: Roof[];
    user: User;
    constructor(the_typology: string) {
        this.typology = the_typology;
        this.obstacleRate = this.getObstacleRatePerTypology();
        this.roofs = [];
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
    computePower () {
        /**
        * Compute the total power of the building (kWc).
        */
        let power: number = 0;
        for (let r of this.roofs) {
            power = power + r.usablePeakPower;
        }
        return this.power = power;
    };
    computePVArea () {
        /**
        * Compute the total photovoltaic area of the building (m²).
        */
        let computedPvArea: number = 0;
        for (let r of this.roofs) {
            computedPvArea = computedPvArea + r.usableArea;
        }
        if (this.pvArea === undefined) {
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
};


const optimizeRoofAreas = (b: Building, actualPvArea: number) => {
    /**
    * Optimize roof area as a function of their productivity:
    */
    let inputArea: number = b.pvArea;
    let computedPvArea: number = actualPvArea;

    let roofProductivities: number[] = [];
    for (let r of b.roofs) {
        roofProductivities.push(r.productivity);
    }
    console.log(roofProductivities);

    let cpt: number = 0;
    while (inputArea < computedPvArea) {
        console.log(cpt);
        // decrease roof usableAreas
        let deltaArea: number = computedPvArea - inputArea;
        // select the roof with the lowest productivity
        for (let r of b.roofs) {
            if (r.productivity === Math.min(...roofProductivities)) {
                r.usableArea = Math.max((r.usableArea - deltaArea),0);
            }
        }
        // lower the roof area
        //b.roofs[roofIndex[cpt]].usableArea = Math.max(r.usableArea,0);

        // update computedPvArea
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

    // TODO: adapt roof areas as a function of their productivity: d'abord decroitre les roofs de plus faible productivité
    // Faut-il vraiment refaire tourner ces fcts? NON/SI slt celles de roof. Les autres sont appelées de toute façon

    // b.computePower();
    // b.computeProduction();
    // f.computePVCost();
}

export { Building };
