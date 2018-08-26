"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run_1 = require("./run");
var roofs = [
    { 'area': 5, 'productivity': 1050, 'tilt': 30, 'azimuth': 120 },
    { 'area': 70, 'productivity': 1850, 'tilt': 30, 'azimuth': 110 },
    { 'area': 300, 'productivity': 50, 'tilt': 30, 'azimuth': 150 }
];
var fullInputs = {
    roofs: roofs,
    pvTechnology: 'poly',
    nYears: 15,
    currentYear: 2018,
    elecSellingPrice: 0.03,
    CVPrice: 85,
    pvArea: -9999,
    annualConsumptionKWh: 2036,
    installationPrice: -9999,
    obstacleRate: 0.3,
    VATrate: 0.06,
    annualMaintenanceCost: -9999,
    loanPeriod: 5,
    loanRate: 0.01,
    loan: false,
    energySobriety: true,
    chargeShift: false,
    pvHeater: true,
    battery: true,
    thermicHouseholdPerson: 5,
    thermicLiterByPersonByDay: 30,
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
