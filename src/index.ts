/*
 * src/index.ts
 *
 *
 * Copyright (C) 2018 Marc Ducobu <marc.ducobu@champs-libres.coop>
 * Copyright (C) 2018 Julien Minet <julien.minet@champs-libres.coop>
 *
 *  License in LICENSE file at the root of the repository.
 */

import {solarFinSim} from './run';


// TODO: These objects Building and Roofs should be constructed by parsing some geojson from lot-1


interface roof {
    'area': number;
    'productivity': number;
}

interface inputs {
    'nYears': number;
    'currentYear': number;
    'typology': string;
    'roofs':  roof[];
}


const inputsFactory = (
        roofs: roof[], /* required */
        nYears = 25, /* default */
        currentYear = 2018, /* default */
        typology = 'residential' /* default */
    ): inputs => {
    /**
    * @param roofs - Array of roof objects
    * Build the inputs for solarFinSim with default and required values
    */
    return {
        nYears: nYears,
        currentYear: currentYear,
        typology: typology,
        roofs: roofs
    }
};

interface outputs {
    'energeticCost': number;
};

// Set parameters
//let nYears: number = 20;
let currentYear: number = 2016; // TODO: get from (new Date()).getFullYear()?
//let typology: string = 'residential';
let roofs: roof[] = [
    {'area': 60, 'productivity': 1200},
];
console.log(roofs);

let inputs_test = inputsFactory(roofs, undefined, currentYear);
console.log(inputs_test);

let results = solarFinSim(inputs_test);
console.log(results);

export {inputs, outputs};
