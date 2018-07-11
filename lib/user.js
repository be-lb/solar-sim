"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
;
var User = (function () {
    function User() {
    }
    User.prototype.computeAnnualElecConsumption = function () {
        return this.annualElectricityConsumption =
            constants.ANNUAL_CONSUMPTION_BASE +
                constants.WASHING_MACHINE_FACTOR * Number(this.hasWashingMachine) +
                constants.ELECTRIC_WATER_HEATER_FACTOR * Number(this.hasElectricWaterHeater) +
                constants.ELECTRIC_HEATING_FACTOR * Number(this.hasElectricHeating);
    };
    ;
    User.prototype.computeSelfConsumptionRate = function () {
        return this.selfProductionRate = 0.30;
    };
    ;
    return User;
}());
exports.User = User;
;
