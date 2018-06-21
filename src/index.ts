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
import {Financial, computeFinancialAmortization} from './financial';

// load geojson of roof shape & properties

// TODO: These objects Building and Roofs should be constructed by parsing some geojson from lot-1
let b = new Building();
b.typology = 'residential';

// Compute PV production
let pv = new PV();
pv.building = b;
pv.setup = 'default';
pv.getSetupFactor();

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
f.computeElecBuyingPrice();
f.computePVCost();

// Compute results
let year_start: number = 2018;
let year_end: number = 2018+25;
computeFinancialAmortization(b, f, year_start, year_end);

// Log object
console.log(b);
console.log(f);
