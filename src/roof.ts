import { Building } from './building';
import * as debug from 'debug';
import { Constants, PvTech } from './io';

const logger = debug('solar-sim:roof');

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
    technology: PvTech;
    setup: string;
    setupFactor: number;
    yield: number;
    building: Building;
    roofProduction: number;
    constructor(
        readonly constants: Constants,
        the_raw_area: number,
        the_productivity: number,
        the_tilt: number,
        the_azimuth: number,
        the_technology: PvTech,
        b: Building
    ) {
        this.rawArea = the_raw_area;
        this.productivity = this.setProductivity(the_productivity);
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
    getSetupFactor() {
        /**
        * @param tilt - roof inclination (°)
        * Function for selecting the setup factor given the roof inclination (tilt)
        */
        if (this.setupFactor === undefined) {
            return this.setupFactor = this.tilt < this.constants.flat_roof_tilt ? 0.5 : 1
        } else {
            return this.setupFactor;
        }
    };
    getPVYield() {
        /**
        * Look-up function for selecting the PV yield depending on the technology
        */
        if (this.yield === undefined) {
            return this.yield = this.constants.pv_yield[this.technology];
        } else {
            return this.yield;
        }
    };
    computeRoofUsableArea() {
        /**
        * @param rawArea - raw area of the roof (m²)
        * @param tilt - tilt of the roof (°)
        * @param productivity - solar productivity of the roof (kWh/kWc)
        * @param obstacleRate - percentage of obstacle where solar panels cannot be installed
        * Compute a usable area based on the obstacle rate of the building
        */
        let isAboveProductivityLimit: number;
        if (this.usableArea === undefined) {
            if (this.productivity < this.constants.low_productivity_limit) {
                isAboveProductivityLimit = 0;
            } else {
                isAboveProductivityLimit = 1;
            }
            if (this.tilt < this.constants.flat_roof_tilt) { // flat roof
                return this.usableArea =
                    isAboveProductivityLimit * 0.57 * this.rawArea * (1 - this.building.obstacleRate - this.constants.lost_space_rate);
            } else {
                return this.usableArea =
                    isAboveProductivityLimit * this.rawArea * (1 - this.building.obstacleRate - this.constants.lost_space_rate);
            }
        } else {
            return this.usableArea;
        }
    };
    computeRawPeakPower() {
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
    computeUsablePeakPower() {
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
    computeRoofProduction() {
        /**
        * @param productivity - solar productivity (kWh/kWc) by m²?
        * @param PeakPower - peak power of the potential installation (kWc)
        * Compute the production (kWh) of the roof given the peak power and the roof productivity
        */

        return this.roofProduction = this.usablePeakPower * this.productivity;
    };
    setProductivity(the_productivity: number) {
        /**
        * Function for avoiding aberrant values for the productivity
        **/
        let productivity: number = the_productivity;
        if (the_productivity > this.constants.max_solar_productivity) {
            productivity = this.constants.max_solar_productivity;
            logger(`Warning! Roof productivity too large: ${the_productivity} kWh/m²`);

        }
        return productivity;
    }
};

export { Roof };
