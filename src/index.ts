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
import {inputs, outputs, roof} from './io';

const inputsFactory = (
        roofs: roof[], /* required */
        nYears = 10, /* default */
        currentYear = 2018, /* default */
        typology = 'closed' /* default */
    ): inputs => {
    /**
    * @param roofs - Array of roof objects
    * Build the inputs for solarSim with default and required values
    */
    return {
        nYears: nYears,
        currentYear: currentYear,
        typology: typology,
        roofs: roofs
    }
};



// Set parameters
//let nYears: number = 20;
let currentYear: number = 2018; // TODO: get from (new Date()).getFullYear()?
//let typology: string = 'closed';
let roofs: roof[] = [
    {'area': 60, 'productivity': 1200},
];
console.log(roofs);

let inputs_test = inputsFactory(roofs, undefined, currentYear);
console.log(inputs_test);

let results = solarSim(inputs_test);
console.log(results);

export {inputs, outputs};
