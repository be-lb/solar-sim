/*
 * src/index.ts
 *
 *
 * Copyright (C) 2018 Marc Ducobu <marc.ducobu@champs-libres.coop>
 * Copyright (C) 2018 Julien Minet <julien.minet@champs-libres.coop>
 *
 *  License in LICENSE file at the root of the repository.
 */

import {solarSim} from './run';
import {inputsFactory, roof} from './io';

// Set parameters
let roofs: roof[] = [
    {'area': 30, 'productivity': 1800, 'tilt': 30},
    {'area': 30, 'productivity': 800, 'tilt': 30},
    {'area': 20, 'productivity': 1200, 'tilt': 30}
];
let nYears: number = 10;
let currentYear: number = 2018; // TODO: get from (new Date()).getFullYear()?

let inputs_test = inputsFactory(roofs, undefined, nYears, currentYear);

let results = solarSim(inputs_test);
console.log(results);
