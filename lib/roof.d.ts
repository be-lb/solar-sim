import { Building } from './building';
import { Constants, PvTech } from './io';
export interface PVYieldObject {
    [key: string]: number;
}
declare class Roof {
    readonly constants: Constants;
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
    constructor(constants: Constants, the_raw_area: number, the_productivity: number, the_tilt: number, the_azimuth: number, the_technology: PvTech, b: Building);
    getSetupFactor(): number;
    getPVYield(): number;
    computeRoofUsableArea(): number;
    computeRawPeakPower(): number;
    computeUsablePeakPower(): number;
    computeRoofProduction(): number;
    setProductivity(the_productivity: number): number;
}
export { Roof };
