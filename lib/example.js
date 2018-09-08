"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run_1 = require("./run");
var roofs = [
    { 'area':10, 'productivity': 950, 'tilt': 35, 'azimuth': 110 }
];
var fullInputs = {
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
    energySobriety: false,
    chargeShift: false,
    pvHeater: false,
    battery: false,
    thermicHouseholdPerson: 5,
    thermicLiterByPersonByDay: 30,
    thermicLiterByDay: 180,
    thermicHotWaterProducer: 'electric',
    thermicCost: -9999,
    thermicAnnualMaintenanceCost: -9999,
    thermicMaintenanceRate: 3,
    thermicGrant: 2500
};
var outputs = run_1.solarSim(fullInputs);
console.log(outputs);
var thermic_outputs = run_1.thermicSolarSim(fullInputs);
console.log(thermic_outputs);
