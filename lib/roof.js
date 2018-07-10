"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
;
;
var Roof = (function () {
    function Roof(the_raw_area, the_productivity, the_tilt, the_setup, the_technology, b) {
        this.rawArea = the_raw_area;
        this.productivity = the_productivity;
        this.tilt = the_tilt;
        this.technology = the_technology;
        this.yield = this.getPVYield();
        this.setup = the_setup;
        this.setupFactor = this.getSetupFactor();
        this.building = b;
        this.usableArea = this.computeRoofUsableArea();
        this.rawPeakPower = this.computeRawPeakPower();
        this.usablePeakPower = this.computeUsablePeakPower();
        this.roofProduction = this.computeRoofProduction();
    }
    Roof.prototype.getSetupFactor = function () {
        if (this.setupFactor === undefined) {
            return this.setupFactor = constants.PV_SETUP[this.setup];
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
        if (this.usableArea === undefined) {
            if (this.tilt < 0.05) {
                return this.usableArea =
                    0.57 * this.rawArea * (1 - this.building.obstacleRate);
            }
            else {
                return this.usableArea =
                    this.rawArea * (1 - this.building.obstacleRate);
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
