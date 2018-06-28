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


// interface roof {
//     'area': number;
//     'productivity': number;
// }

interface inputs {
    'nYears': number;
    'currentYear': number;
    'typology': string;
    //'roofs':  roof;
}


const inputsFactory = (
        nYears=25, /* default */
        currentYear=2018, /* default */
        typology='residential' /* default */
      //  roofs: roof[] /* required */
    ): inputs => {
    /**
    * Build the inputs for solarFinSim with default values
    */
    return {
        nYears: nYears,
        currentYear: currentYear,
        typology: typology,
        //roofs: roofs
    }
};

interface outputs {
    'energeticCost': number;
};

// Set parameters
let nYears: number = 20;
//let currentYear: number = 2018; // TODO: get from (new Date()).getFullYear()?
//let typology: string = 'residential';
// let roofs: roof[] = [
//     {'area': 60, 'productivity': 1200},
// ];


let inputs_test = inputsFactory(nYears);
console.log(inputs_test);

let results = solarFinSim(inputs_test);
console.log(results);

export {inputs, outputs};
