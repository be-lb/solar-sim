import {Building} from './building';
import * as constants from './constants';

export interface PVSetupObject {
    [key: string]: number;
};

export interface PVYieldObject {
    [key: string]: number;
};

class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    rawPeakPower: number;
    usablePeakPower: number;
    technology: string;
    setup: string;
    setupFactor: number;
    yield: number;
    productionYearlyLossIndex: number = constants.PRODUCTION_YEARLY_LOSS_INDEX;
    building: Building;
    roofProduction: number;
    constructor(the_raw_area: number, the_productivity: number, the_setup: string, the_technology:string, b: Building) {
        this.rawArea = the_raw_area;
        this.productivity = the_productivity;
        this.technology = the_technology;
        this.yield = this.getPVYield();
        this.setup = the_setup;
        this.setupFactor = this.getSetupFactor();
        this.building = b;
        this.usableArea = this.computeRoofUsableArea();
        this.rawPeakPower = this.computeRawPeakPower();
        this.usablePeakPower = this.computeUsablePeakPower();
        this.roofProduction = this.computeRoofProduction();
    }
    getSetupFactor () {
        /**
        * @param setup - configuration of the photovoltaic installation
        * Look-up function for selecting the setup factor given some setup
        */
        if (this.setupFactor === undefined) {
            return this.setupFactor = constants.PV_SETUP[this.setup];
        } else {
            return this.setupFactor;
        }
    };
    getPVYield () {
        /**
        * Look-up function for selecting the PV yield depending on the technology
        */
        if (this.yield === undefined) {
            return this.yield = constants.PV_YIELD[this.technology];
        } else {
            return this.yield;
        }
    };
    computeRoofUsableArea () {
        /**
        * @param rawArea - raw area of the roof (m²)
        * @param obstacleRate - percentage of obstacle where solar panels cannot be installed
        * Compute a usable area based on the obstacle rate of the building
        */
        if (this.usableArea === undefined) {
            return this.usableArea =
            this.rawArea * (1 - this.building.obstacleRate);
        } else {
            return this.usableArea;
        }
    };
    computeRawPeakPower () {
        /**
        * @param rawArea - raw area of the roof (m²)
        * @param setupFactor - type of mounting of the photovoltaic installation
        * @param yield - yield of the photovoltaic installation
        * Returns the raw peak power of the roof (kWc)
        */
        return this.rawPeakPower =
        this.rawArea / (1000 / (1000 * this.yield) * this.setupFactor)
        ;
    };
    computeUsablePeakPower () {
        /**
        * @param usableArea - usable area for photovoltaic installation (m²)
        * @param setupFactor - type of mounting of the photovoltaic installation
        * @param yield - yield of the photovoltaic installation
        * Returns the usable peak power of the roof (kWc)
        */
        this.computeRoofUsableArea();
        return this.usablePeakPower =
        this.usableArea / (1000 / (1000 * this.yield) * this.setupFactor)
        ;
    };
    computeRoofProduction () {
        /**
        * @param productivity - solar productivity (kWh/kWc)
        * @param PeakPower - peak power of the potential installation (kWc)
        * Compute the production (kWh) of the roof given the peak power and the roof productivity
        */
        if (this.roofProduction === undefined) {
          // TODO: check with APERE why use the raw peak power here.
            return this.roofProduction = this.usablePeakPower * this.productivity;
        } else {
            return this.roofProduction;
        }
    };
};

export { Roof };
