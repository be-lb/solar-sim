"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
var Environmental = (function () {
    function Environmental(the_origin) {
        this.origin = the_origin;
    }
    return Environmental;
}());
exports.Environmental = Environmental;
;
;
;
;
var getEnvironmentalCosts = function (environmental, building) {
    var origin = environmental.origin;
    var energeticCost = 0;
    for (var _i = 0, _a = building.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        energeticCost = energeticCost + r.rawPeakPower * constants.ENERGETIC_COST_FACTOR[origin];
    }
    ;
    var panels = constants.BREAKDOWN_COST_FACTOR[origin].panels;
    var setup = constants.BREAKDOWN_COST_FACTOR[origin].setup;
    var inverter = constants.BREAKDOWN_COST_FACTOR[origin].inverter;
    var transportBE = constants.BREAKDOWN_COST_FACTOR[origin].transportBE;
    var transportEU = constants.BREAKDOWN_COST_FACTOR[origin].transportEU;
    var transportBoat = constants.BREAKDOWN_COST_FACTOR[origin].transportBoat;
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
        'energeticReturnFactor': energeticReturnFactor,
        'energeticReturnTime': energeticReturnTime
    };
};
exports.computeEnergeticReturn = computeEnergeticReturn;
var computeSavedCO2Emissions = function (actualProduction) {
    return sum(actualProduction) * constants.CO2_EMISSIONS_BY_KWH;
};
exports.computeSavedCO2Emissions = computeSavedCO2Emissions;
var sum = function (arr) {
    return arr.reduce(function (a, b) { return a + b; }, 0);
};
exports.sum = sum;
