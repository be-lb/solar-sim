"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run_1 = require("./run");
var roofs = [
    { 'area': 50, 'productivity': 1050, 'tilt': 30 },
    { 'area': 70, 'productivity': 850, 'tilt': 30 },
    { 'area': 300, 'productivity': 50, 'tilt': 30 }
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
    obstacleRate: 0.2,
    VATrate: 0.21,
    annualMaintenanceCost: -9999,
    loanPeriod: 5,
    loanRate: 0.01,
    loan: true,
    energySobriety: true,
    chargeShift: false,
    pvHeater: true,
    battery: true,
};
var outputs2 = run_1.solarSim(fullInputs);
console.log(outputs2);
