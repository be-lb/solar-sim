import {Building} from './building';
import * as constants from './constants';

export interface PVYieldObject {
    [key: string]: number;
};

class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    tilt: number;
    azimuth: number;
    rawPeakPower: number;
    usablePeakPower: number;
    technology: string;
    setup: string;
    setupFactor: number;
    yield: number;
    building: Building;
    roofProduction: number;
    constructor(the_raw_area: number, the_productivity: number, the_tilt: number, the_azimuth: number, the_technology:string, b: Building) {
        this.rawArea = the_raw_area;
        this.productivity = the_productivity;
        this.tilt = the_tilt;
        this.azimuth = the_azimuth;
        this.technology = the_technology;
        this.yield = this.getPVYield();
        this.setupFactor = this.getSetupFactor();
        this.building = b;
        this.usableArea = this.computeRoofUsableArea();
        this.rawPeakPower = this.computeRawPeakPower();
        this.usablePeakPower = this.computeUsablePeakPower();
        this.roofProduction = this.computeRoofProduction();
    }
    getSetupFactor () {
        /**
        * @param tilt - roof inclination (°)
        * Function for selecting the setup factor given the roof inclination (tilt)
        */
        if (this.setupFactor === undefined) {
            return this.setupFactor = this.tilt < constants.FLAT_ROOF_TILT ? 0.5 : 1
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
        * @param tilt - tilt of the roof (°)
        * @param productivity - solar productivity of the roof (kWh/kWc)
        * @param obstacleRate - percentage of obstacle where solar panels cannot be installed
        * Compute a usable area based on the obstacle rate of the building
        */
        let isAboveProductivityLimit: number;
        if (this.usableArea === undefined) {
            if (this.productivity < constants.LOW_PRODUCTIVITY_LIMIT) {
                isAboveProductivityLimit = 0;
            } else {
                isAboveProductivityLimit = 1;
            }
            if (this.tilt < constants.FLAT_ROOF_TILT) { // flat roof
                return this.usableArea =
                isAboveProductivityLimit * 0.57 * this.rawArea * (1 - this.building.obstacleRate);
            } else {
                return this.usableArea =
                isAboveProductivityLimit * this.rawArea * (1 - this.building.obstacleRate);
            }
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

        return this.roofProduction = this.usablePeakPower * this.productivity;
    };
};

export { Roof };
