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

// Set number of years for computation
let nYears: number = 25;
let currentYear: number = 2018; // TODO: get from (new Date()).getFullYear()?
// load geojson of roof shape & properties

let typology: string = 'residential';

// TODO: These objects Building and Roofs should be constructed by parsing some geojson from lot-1

interface inputs {
    'nYears': number;
    'currentYear': number;
    'typology': string;
};

interface outputs {
    'energeticCost': number;
};


let inputs_test : inputs = {
   'nYears': nYears,
   'currentYear': currentYear,
   'typology': typology
}
let results = solarFinSim(inputs_test);
console.log(results);

export {inputs, outputs};
