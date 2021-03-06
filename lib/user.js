"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var logger = debug('solar-sim:user');
;
var User = (function () {
    function User(constants, annual_consumption, energy_sobriety, charge_swift, pv_heater, battery, b) {
        this.constants = constants;
        this.annualElectricityConsumption = annual_consumption;
        this.baseAnnualElectricityConsumption = annual_consumption;
        this.hasEnergySobriety = energy_sobriety;
        this.hasChargeSwift = charge_swift;
        this.hasPvHeater = pv_heater;
        this.hasBattery = battery;
        this.building = b;
    }
    User.prototype.computeAnnualElecConsumption = function () {
        var annualElectricityConsumption = this.annualElectricityConsumption;
        if (this.hasEnergySobriety) {
            annualElectricityConsumption = annualElectricityConsumption * this.constants.energy_sobriety_factor;
        }
        if (this.hasPvHeater) {
            annualElectricityConsumption = annualElectricityConsumption +
                Math.max(this.constants.electric_water_heater_min_consumption, annualElectricityConsumption * (1 - this.constants.electric_water_heater_factor));
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
        var keys = Object.keys(this.constants.self_production['default']).map(function (x) { return x; });
        var ratio = this.building.production / this.baseAnnualElectricityConsumption;
        var diff = keys.map(function (x) { return Math.abs(Number(x) - ratio); });
        var ratioKey = keys[0];
        for (var _i = 0, diff_1 = diff; _i < diff_1.length; _i++) {
            var d = diff_1[_i];
            if (d === Math.min.apply(Math, diff)) {
                ratioKey = keys[diff.indexOf(d)];
            }
        }
        if (userChoiceKey !== 'battery' && userChoiceKey !== 'pvHeater' && userChoiceKey !== 'chargeShift' && userChoiceKey !== 'energySobriety' && userChoiceKey !== 'default') {
            logger("Error in the selfProduction rate selection: " + userChoiceKey);
            userChoiceKey = 'default';
        }
        var selfProductionRate = this.constants.self_production[userChoiceKey][ratioKey];
        selfProductionRate = selfProductionRate === undefined ? 0.35 : selfProductionRate;
        return this.selfProductionRate = selfProductionRate;
    };
    ;
    return User;
}());
exports.User = User;
;
