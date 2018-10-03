"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Environmental = (function () {
    function Environmental(origin) {
        this.origin = origin;
    }
    return Environmental;
}());
exports.Environmental = Environmental;
;
var getEnvironmentalCosts = function (environmental, building, constants) {
    var origin = environmental.origin;
    var energeticCost = building.power * constants.energetic_cost_factor[origin];
    var panels = constants.breakdown_cost_factor[origin].panels;
    var setup = constants.breakdown_cost_factor[origin].setup;
    var inverter = constants.breakdown_cost_factor[origin].inverter;
    var transportBE = constants.breakdown_cost_factor[origin].transportBE;
    var transportEU = constants.breakdown_cost_factor[origin].transportEU;
    var transportBoat = constants.breakdown_cost_factor[origin].transportBoat;
    return {
        'energeticCost': energeticCost,
        'panels': panels,
        'setup': setup,
        'inverter': inverter,
        'transportBE': transportBE,
        'transportEU': transportEU,
        'transportBoat': transportBoat
    };
};
exports.getEnvironmentalCosts = getEnvironmentalCosts;
;
var computeEnergeticReturn = function (energeticCost, production, actualProduction) {
    var energeticReturnFactor = sum(actualProduction) / energeticCost;
    var energeticReturnTime = energeticCost / production;
    return {
        energeticReturnFactor: energeticReturnFactor,
        energeticReturnTime: energeticReturnTime,
    };
};
exports.computeEnergeticReturn = computeEnergeticReturn;
var computeSavedCO2Emissions = function (actualProduction, constants) {
    return sum(actualProduction) * constants.co2_emissions_by_kwh;
};
exports.computeSavedCO2Emissions = computeSavedCO2Emissions;
var sum = function (arr) {
    return arr.reduce(function (a, b) { return a + b; }, 0);
};
exports.sum = sum;
