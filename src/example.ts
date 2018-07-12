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
    {'area': 100, 'productivity': 1800, 'tilt': 30, 'truc': 'whatever'},
    {'area': 20, 'productivity': 800, 'tilt': 30},
    {'area': 10, 'productivity': 1200, 'tilt': 30}
];


// let inputs = inputsFactory(roofs);
//
// let outputs = solarSim(inputs);
// console.log(outputs);

// Example with all input parameters with the same roof collection
let fullInputs: inputs = {
    roofs: roofs,
    pvTechnology: 'poly',
    nYears: 10,
    currentYear: 2018,
    elecSellingPrice: 0.03,
    CVPrice: 85,
    pvArea: -9999,
    annualConsumptionKWh: -9999,
    installationPrice: -9999,
    obstacleRate: 0.2,
    VATrate: 0.21,
    annualMaintenanceCost: -9999,
    loanPeriod: 5,
    loanRate: 0.01,
    loan: false,
    energySobriety: true,
    chargeShift: false,
    pvHeater: true,
    battery: true,
}
let outputs2 = solarSim(fullInputs);
console.log(outputs2);
