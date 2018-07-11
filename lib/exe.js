"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var run_1 = require("./run");
axios_1.default.get('../src/data.json')
    .then(function (response) {
    var roofs = response.data;
    var input = {
        roofs: roofs,
        pvTechnology: 'poly',
        nYears: 25,
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
        energySobriety: false,
        chargeShift: false,
        pvHeater: false,
        battery: false,
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
