/*
 * src/index.ts
 *
 *
 * Copyright (C) 2018 Marc Ducobu <marc.ducobu@champs-libres.coop>
 * Copyright (C) 2018 Julien Minet <julien.minet@champs-libres.coop>
 *
 *  License in LICENSE file at the root of the repository.
 */

import {Building} from './building';
import {Roof} from './roof';
import {User} from './user';
import {PV} from './pv';
import {Financial, computeActualAnnualProduction, computeFinancialAmortization, getFinancialYear1} from './financial';
import {Environmental, computeCO2Emissions, getEnvironmentalCosts, computeEnergeticReturn} from './environmental';

// Set number of years for computation
let nYears: number = 25;
const currentYear: number = 2018; // TODO: get from the browser?

// load geojson of roof shape & properties

// TODO: These objects Building and Roofs should be constructed by parsing some geojson from lot-1
let b = new Building('residential');

// Compute PV production
let pv = new PV('default');
pv.building = b;

// Compute roof usable areas
let r1 = new Roof();
r1.rawArea = 30;
r1.productivity = 950;
r1.building = b;

b.roofs = [r1];
for (let roof of b.roofs) {
   roof.computeRoofUsableArea();
   roof.computeRawPeakPower(pv);
   roof.computeUsablePeakPower(pv);
}

pv.computeProduction();
b.pv = pv;

// User information
let u = new User();
u.hasWashingMachine = true;
u.hasElectricWaterHeater = true;
u.hasElectricHeating = false;
u.computeAnnualElecConsumption();
b.user = u;

// Financial information
let f = new Financial();
f.building = b;
f.computePVCost();

// Log object
//console.log(b);

// 1) Financial results
//computeFinancialAmortization(b, f, nYears);
let financialAmortization = computeFinancialAmortization(b, f, nYears, currentYear);
let selfConsumptionAmount = financialAmortization.selfConsumptionAmount;
let CVAmount = financialAmortization.CVAmount;
let financialYear1 = getFinancialYear1(selfConsumptionAmount, CVAmount);
console.log('selfConsumption Year 1 (€): ' + financialYear1.selfConsumptionAmountYear1);
console.log('CV selling Year 1 (€): ' + financialYear1.CVAmountYear1);

// 2) Environmental results
// 2.1) CO2 emissions
let actualProduction = computeActualAnnualProduction(pv.production, pv.productionYearlyLossIndex, nYears);
let CO2emissions = computeCO2Emissions(actualProduction);
console.log('CO2 emissions : ' + CO2emissions);
// 2.2) Energetic costs
let e = new Environmental('Belgium');
let environmentalCosts = getEnvironmentalCosts(e, r1);
console.log('energetic cost : ' + environmentalCosts.energeticCost);  // because inconsistence dans maquette xls sur la puissance utilisée
// 2.3) Environmental return
let energeticReturn = computeEnergeticReturn(environmentalCosts.energeticCost, pv.production);
console.log('Energetic return time : ' + energeticReturn.energeticReturnTime);
console.log('Energetic return factor : ' + energeticReturn.energeticReturnFactor);
