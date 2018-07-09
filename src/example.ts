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
import {roof, inputs} from './io';

// Example with required parameters only
let roofs: roof[] = [
    {'area': 30, 'productivity': 1800, 'tilt': 30, 'truc': 'whatever'},
    {'area': 20, 'productivity': 800, 'tilt': 30},
    {'area': 40, 'productivity': 1200, 'tilt': 30}
];
//
// let inputs = inputsFactory(roofs);
//
// let outputs = solarSim(inputs);
// console.log(outputs);

// Example with all input parameters with the same roof collection
let fullInputs: inputs = {
    roofs: roofs,
    typology: 'closed',
    nYears: 10,
    currentYear: 2018,
    pvSetup: 'default',
    pvTechnology: 'poly',
    elecSellingPrice: 0.03,
    CVPrice: 85,
    pvArea: -9999,
}
let outputs2 = solarSim(fullInputs);
console.log(outputs2);
