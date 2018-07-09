// Based on lib/exe.js
// run with node as node ./test/functional.js


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run = require("../lib/run");

var N = 50;
for (var ii = 1; ii <= N; ii++) {
    var roofs = [
        {'area': 10, 'productivity': 3800, 'tilt': 30, 'truc': 'whatever'},
        {'area': 20, 'productivity': 200, 'tilt': 30},
        {'area': 40, 'productivity': 1200, 'tilt': 30}
    ];
    var input = {
        roofs: roofs,
        typology: 'closed',
        nYears: 25,
        currentYear: 2018,
        pvSetup: 'default',
        pvTechnology: 'poly',
        elecSellingPrice: 0.03,
        CVPrice: 85,
        pvArea: ii*5,
    };
    var outputs = run.solarSim(input);
    //console.log('area = ' + outputs.setup.area + ' m²');
    console.log('production = ' + outputs.energy.annualProduction + ' kWh/an');
    console.log('total gain on 25 years = ' + outputs.finance.totalGain25Y + ' €');
};
