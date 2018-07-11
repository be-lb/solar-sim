"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
;
var User = (function () {
    function User(energy_sobriety, charge_swift, pv_heater, battery, b) {
        this.hasEnergySobriety = energy_sobriety;
        this.hasChargeSwift = charge_swift;
        this.hasPvHeater = pv_heater;
        this.hasBattery = battery;
        this.building = b;
    }
    User.prototype.computeAnnualElecConsumption = function () {
        return this.annualElectricityConsumption =
            constants.ANNUAL_CONSUMPTION_BASE;
    };
    ;
    User.prototype.computeSelfConsumptionRate = function () {
        return this.selfProductionRate = 0.3;
    };
    ;
    return User;
}());
exports.User = User;
;
