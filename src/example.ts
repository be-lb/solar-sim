/*
 * src/index.ts
 *
 *
 * Copyright (C) 2018 Marc Ducobu <marc.ducobu@champs-libres.coop>
 * Copyright (C) 2018 Julien Minet <julien.minet@champs-libres.coop>
 *
 *  License in LICENSE file at the root of the repository.
 */

import {solarSim, thermicSolarSim} from './run';
import {roof, inputs} from './io';

// Example with required parameters only
// let roofs: roof[] = [
//     {'area': 5, 'productivity': 1050, 'tilt': 30, 'azimuth': 120},
//     {'area': 70, 'productivity': 1850, 'tilt': 30, 'azimuth': 110},
//     {'area': 300, 'productivity': 50, 'tilt': 30, 'azimuth': 150}
// ];
let roofs: roof[] = [
    {'area': 2400/0.8, 'productivity': 950, 'tilt': 35, 'azimuth': 110}
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
    annualConsumptionKWh: 2036,
    installationPrice: -9999,
    obstacleRate: 0.2,
    VATrate: 0.06,
    annualMaintenanceCost: -9999,
    loanPeriod: 5,
    loanRate: 0.01,
    loan: false,
    energySobriety: true,
    chargeShift: false,
    pvHeater: false,
    battery: false,
    thermicHouseholdPerson: 5,
    thermicLiterByPersonByDay: 30,
    thermicLiterByDay: 180,
    thermicHotWaterProducer: 'fuel',
    thermicCost: -9999,
    thermicAnnualMaintenanceCost: -9999,
    thermicMaintenanceRate: 3,
    thermicGrant: 2500
}
let outputs = solarSim(fullInputs);
console.log(outputs);

let thermic_outputs = thermicSolarSim(fullInputs);
console.log(thermic_outputs);
