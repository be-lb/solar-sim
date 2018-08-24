"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
;
var Roof = (function () {
    function Roof(the_raw_area, the_productivity, the_tilt, the_azimuth, the_technology, b) {
        this.rawArea = the_raw_area;
        this.productivity = the_productivity;
        this.tilt = the_tilt;
        this.azimuth = the_azimuth;
        this.technology = the_technology;
        this.yield = this.getPVYield();
        this.setupFactor = this.getSetupFactor();
        this.building = b;
        this.usableArea = this.computeRoofUsableArea();
        this.rawPeakPower = this.computeRawPeakPower();
        this.usablePeakPower = this.computeUsablePeakPower();
        this.roofProduction = this.computeRoofProduction();
    }
    Roof.prototype.getSetupFactor = function () {
        if (this.setupFactor === undefined) {
            return this.setupFactor = this.tilt < constants.FLAT_ROOF_TILT ? 0.5 : 1;
        }
        else {
            return this.setupFactor;
        }
    };
    ;
    Roof.prototype.getPVYield = function () {
        if (this.yield === undefined) {
            return this.yield = constants.PV_YIELD[this.technology];
        }
        else {
            return this.yield;
        }
    };
    ;
    Roof.prototype.computeRoofUsableArea = function () {
        var isAboveProductivityLimit;
        if (this.usableArea === undefined) {
            if (this.productivity < constants.LOW_PRODUCTIVITY_LIMIT) {
                isAboveProductivityLimit = 0;
            }
            else {
                isAboveProductivityLimit = 1;
            }
            if (this.tilt < constants.FLAT_ROOF_TILT) {
                return this.usableArea =
                    isAboveProductivityLimit * 0.57 * this.rawArea * (1 - this.building.obstacleRate);
            }
            else {
                return this.usableArea =
                    isAboveProductivityLimit * this.rawArea * (1 - this.building.obstacleRate);
            }
        }
        else {
            return this.usableArea;
        }
    };
    ;
    Roof.prototype.computeRawPeakPower = function () {
        return this.rawPeakPower =
            this.rawArea / (1000 / (1000 * this.yield) * this.setupFactor);
    };
    ;
    Roof.prototype.computeUsablePeakPower = function () {
        return this.usablePeakPower =
            this.usableArea / (1000 / (1000 * this.yield) * this.setupFactor);
    };
    ;
    Roof.prototype.computeRoofProduction = function () {
        return this.roofProduction = this.usablePeakPower * this.productivity;
    };
    ;
    return Roof;
}());
exports.Roof = Roof;
;
