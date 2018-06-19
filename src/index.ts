/*
 * src/index.ts
 *
 *
 * Copyright (C) 2015-2017 Pierre Marchand <pierremarc07@gmail.com>
 * Copyright (C) 2017 Pacôme Béru <pacome.beru@gmail.com>
 *
 *  License in LICENSE file at the root of the repository.
 */

import {Building, Roof, computeRoofUsableArea} from './building';

//export type Name = string;


// export const helloWorld =
//     (n: Name) => `Hello ${n}!`;

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
