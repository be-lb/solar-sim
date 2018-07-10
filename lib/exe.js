"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var run_1 = require("./run");
axios_1.default.get('../src/data.json')
    .then(function (response) {
    var roofs = response.data;
    var input = {
        roofs: roofs,
        typology: 'closed',
        nYears: 25,
        currentYear: 2018,
        pvSetup: 'default',
        pvTechnology: 'poly',
        elecSellingPrice: 0.03,
        CVPrice: 85,
        pvArea: -9999,
    };
    var results = run_1.solarSim(input);
    console.log(results);
    var res_energeticCost = document.getElementById("res_energeticCost");
    console.log(results.main.savedCO2emissions);
    if (res_energeticCost) {
        res_energeticCost.innerHTML = results.main.savedCO2emissions.toString();
    }
})
    .catch(function (error) {
    console.log(error);
});
