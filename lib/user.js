"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
;
var User = (function () {
    function User(annual_consumption, energy_sobriety, charge_swift, pv_heater, battery, b) {
        this.annualElectricityConsumption = annual_consumption;
        this.hasEnergySobriety = energy_sobriety;
        this.hasChargeSwift = charge_swift;
        this.hasPvHeater = pv_heater;
        this.hasBattery = battery;
        this.building = b;
    }
    User.prototype.computeAnnualElecConsumption = function () {
        var annualElectricityConsumption = this.annualElectricityConsumption;
        if (annualElectricityConsumption === 2036) {
            if (this.hasPvHeater) {
                annualElectricityConsumption = annualElectricityConsumption + constants.ELECTRIC_WATER_HEATER_FACTOR;
            }
        }
        return this.annualElectricityConsumption = annualElectricityConsumption;
    };
    ;
    User.prototype.computeSelfConsumptionRate = function () {
        var userChoiceKey;
        if (this.hasBattery) {
            userChoiceKey = 'battery';
        }
        else {
            if (this.hasPvHeater) {
                userChoiceKey = 'pvHeater';
            }
            else {
                if (this.hasChargeSwift) {
                    userChoiceKey = 'chargeShift';
                }
                else {
                    if (this.hasEnergySobriety) {
                        userChoiceKey = 'energySobriety';
                    }
                    else {
                        userChoiceKey = 'default';
                    }
                }
            }
        }
        var keys = Object.keys(constants.SELF_PRODUCTION['default']).map(function (x) { return Number(x); });
        var ratio = this.building.production / this.annualElectricityConsumption;
        var diff = keys.map(function (x) { return Math.abs(x - ratio); });
        var ratioKey = -1;
        for (var _i = 0, diff_1 = diff; _i < diff_1.length; _i++) {
            var d = diff_1[_i];
            if (d === Math.min.apply(Math, diff)) {
                ratioKey = keys[diff.indexOf(d)];
            }
        }
        if (userChoiceKey !== 'battery' || userChoiceKey !== 'pvHeater' || userChoiceKey != 'chargeShift' || userChoiceKey != 'energySobriety' || userChoiceKey != 'default') {
            userChoiceKey = 'default';
            console.log('Error in the selfProduction rate selection!');
        }
        var selfProductionRate = constants.SELF_PRODUCTION[userChoiceKey][ratioKey];
        selfProductionRate = selfProductionRate === undefined ? 0.35 : selfProductionRate;
        return this.selfProductionRate = selfProductionRate;
    };
    ;
    return User;
}());
exports.User = User;
;
