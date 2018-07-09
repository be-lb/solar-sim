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

// Set required parameters
let roofs: roof[] = [
    {'area': 30, 'productivity': 1800, 'tilt': 30},
    {'area': 30, 'productivity': 800, 'tilt': 30},
    {'area': 20, 'productivity': 1200, 'tilt': 30}
];

let inputs = inputsFactory(roofs);

let outputs = solarSim(inputs);
console.log(outputs);
