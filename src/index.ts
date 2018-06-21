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

let r1 = new Roof();
r1.usableArea = 30;
r1.productivity = 950;
r1.building = b;

// Compute roof usable areas
b.roofs = [r1];
for (let roof of b.roofs) {
   roof.computeRoofUsableArea();
}

// Compute PV production
let pv = new PV();
pv.building = b;
pv.setup = 'default';
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
f.computeElecBuyingPrice();

console.log(b);

// Compute results
let year_start: number = 2018;
let year_end: number = 2018+25;
computeFinancialAmortization(b, f, year_start, year_end);
