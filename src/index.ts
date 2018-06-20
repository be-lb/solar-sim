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
import {Roof, computeRoofUsableArea} from './roof';

// load geojson of roof shape & properties

// These objects should be constructed by parsing some geojson from lot-1
let b = new Building();
b.typology = 'residential';

let r1 = new Roof();
r1.rawArea = 120;
r1.building = b;

let r2 = new Roof();
r2.rawArea = 60;
r2.building = b;

let roofs: Roof[] = [r1, r2];
for (let roof of roofs) {
   roof.usableArea = computeRoofUsableArea(roof);
}

console.log(roofs);
