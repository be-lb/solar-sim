import { Building } from './building';
export interface PVSetupObject {
    [key: string]: number;
}
export interface PVYieldObject {
    [key: string]: number;
}
declare class Roof {
    rawArea: number;
    usableArea: number;
    productivity: number;
    tilt: number;
    rawPeakPower: number;
    usablePeakPower: number;
    technology: string;
    setup: string;
    setupFactor: number;
    yield: number;
    building: Building;
    roofProduction: number;
    constructor(the_raw_area: number, the_productivity: number, the_tilt: number, the_setup: string, the_technology: string, b: Building);
    getSetupFactor(): number;
    getPVYield(): number;
    computeRoofUsableArea(): number;
    computeRawPeakPower(): number;
    computeUsablePeakPower(): number;
    computeRoofProduction(): number;
}
export { Roof };
