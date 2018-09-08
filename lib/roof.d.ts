import { Building } from './building';
export interface PVYieldObject {
    [key: string]: number;
}
declare class Roof {
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
    constructor(the_raw_area: number, the_productivity: number, the_tilt: number, the_azimuth: number, the_technology: string, b: Building);
    getSetupFactor(): number;
    getPVYield(): number;
    computeRoofUsableArea(): number;
    computeRawPeakPower(): number;
    computeUsablePeakPower(): number;
    computeRoofProduction(): number;
    setProductivity(the_productivity: number): number;
}
export { Roof };
