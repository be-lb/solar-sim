"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run_1 = require("./run");
var roofs = [
    { 'area': 30, 'productivity': 1800, 'tilt': 30, 'truc': 'whatever' },
    { 'area': 20, 'productivity': 800, 'tilt': 30 },
    { 'area': 40, 'productivity': 1200, 'tilt': 30 }
];
var fullInputs = {
    roofs: roofs,
    typology: 'closed',
    nYears: 10,
    currentYear: 2018,
    pvSetup: 'default',
    pvTechnology: 'poly',
    elecSellingPrice: 0.03,
    CVPrice: 85,
    pvArea: -9999,
};
var outputs2 = run_1.solarSim(fullInputs);
console.log(outputs2);
