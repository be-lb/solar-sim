"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var logger = debug('solar-sim:roof');
;
var Roof = (function () {
    function Roof(constants, the_raw_area, the_productivity, the_tilt, the_azimuth, the_technology, b) {
        this.constants = constants;
        this.rawArea = the_raw_area;
        this.productivity = this.setProductivity(the_productivity);
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
            return this.setupFactor = this.tilt < this.constants.flat_roof_tilt ? 0.5 : 1;
        }
        else {
            return this.setupFactor;
        }
    };
    ;
    Roof.prototype.getPVYield = function () {
        if (this.yield === undefined) {
            return this.yield = this.constants.pv_yield[this.technology];
        }
        else {
            return this.yield;
        }
    };
    ;
    Roof.prototype.computeRoofUsableArea = function () {
        var isAboveProductivityLimit;
        if (this.usableArea === undefined) {
            if (this.productivity < this.constants.low_productivity_limit) {
                isAboveProductivityLimit = 0;
            }
            else {
                isAboveProductivityLimit = 1;
            }
            if (this.tilt < this.constants.flat_roof_tilt) {
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
    Roof.prototype.setProductivity = function (the_productivity) {
        var productivity = the_productivity;
        if (the_productivity > this.constants.max_solar_productivity) {
            productivity = this.constants.max_solar_productivity;
            logger("Warning! Roof productivity too large: " + the_productivity + " kWh/m\u00B2");
        }
        return productivity;
    };
    return Roof;
}());
exports.Roof = Roof;
;
