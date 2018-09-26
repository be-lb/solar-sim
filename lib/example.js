"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run_1 = require("./run");
var roofs = [
    {
        "azimuth": 149.4325327827,
        "productivity": 1945.3562068862,
        "area": 120.9019349646,
        "tilt": 27.1570730376
    },
    {
        "azimuth": 36.1854187033,
        "productivity": 570.1815062421,
        "area": 1191.5398056349,
        "tilt": 0.1266373741
    },
    {
        "azimuth": 149.1765317543,
        "productivity": 521.3345989325,
        "area": 289.2746173713,
        "tilt": 25.0726237712
    }
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
    loanRate: 0.02,
    loan: false,
    energySobriety: true,
    chargeShift: false,
    pvHeater: false,
    battery: false,
    thermicHouseholdPerson: 5,
    thermicLiterByPersonByDay: 30,
    thermicLiterByDay: 80,
    thermicHotWaterProducer: 'fuel',
    thermicCost: -9999,
    thermicAnnualMaintenanceCost: -9999,
    thermicMaintenanceRate: 3,
    thermicGrant: 2500
};
var outputs = run_1.solarSim(fullInputs);
console.log(outputs);
var thermic_outputs = run_1.thermicSolarSim(fullInputs);
console.log(thermic_outputs);
