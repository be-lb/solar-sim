"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("./constants");
var Building = (function () {
    function Building(the_obstacle_rate) {
        this.obstacleRate = the_obstacle_rate;
        this.roofs = [];
    }
    ;
    Building.prototype.computeProduction = function () {
        var production = 0;
        for (var _i = 0, _a = this.roofs; _i < _a.length; _i++) {
            var r = _a[_i];
            production = production + r.roofProduction;
        }
        return this.production = production;
    };
    ;
    Building.prototype.computePower = function () {
        var power = 0;
        for (var _i = 0, _a = this.roofs; _i < _a.length; _i++) {
            var r = _a[_i];
            power = power + r.usablePeakPower;
        }
        if (power > constants.MAX_POWER) {
            optimizeRoofPowers(this, power);
            return this.power = constants.MAX_POWER;
        }
        else {
            return this.power = power;
        }
    };
    ;
    Building.prototype.computePVArea = function () {
        var computedPvArea = 0;
        for (var _i = 0, _a = this.roofs; _i < _a.length; _i++) {
            var r = _a[_i];
            computedPvArea = computedPvArea + r.usableArea;
        }
        if (this.pvArea === -9999) {
            return this.pvArea = computedPvArea;
        }
        else {
            if (this.pvArea < computedPvArea) {
                var area = optimizeRoofAreas(this, computedPvArea);
                return this.pvArea = area;
            }
            else {
                return this.pvArea;
            }
        }
    };
    ;
    Building.prototype.computeMaxPvArea = function () {
        var maxPvArea = 0;
        for (var _i = 0, _a = this.roofs; _i < _a.length; _i++) {
            var r = _a[_i];
            maxPvArea = maxPvArea + r.usablePeakPower * (1000 / (1000 * r.yield) * r.setupFactor);
        }
        return this.maxPvArea = maxPvArea;
    };
    ;
    return Building;
}());
exports.Building = Building;
;
var MAX_ITERATION_WHILE = 200;
var optimizeRoofAreas = function (b, actualPvArea) {
    var inputArea = b.pvArea;
    var computedPvArea = actualPvArea;
    var roofProductivities = [];
    for (var _i = 0, _a = b.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        roofProductivities.push(r.productivity);
    }
    var sortRoofProductivities = roofProductivities.sort(function (a, b) { return a - b; });
    var cpt = 0;
    while (inputArea < computedPvArea && cpt < b.roofs.length && cpt < MAX_ITERATION_WHILE) {
        var deltaArea = computedPvArea - inputArea;
        for (var _b = 0, _c = b.roofs; _b < _c.length; _b++) {
            var r = _c[_b];
            if (r.productivity === sortRoofProductivities[cpt]) {
                r.usableArea = Math.max((r.usableArea - deltaArea), 0);
            }
        }
        computedPvArea = 0;
        for (var _d = 0, _e = b.roofs; _d < _e.length; _d++) {
            var r = _e[_d];
            computedPvArea = computedPvArea + r.usableArea;
        }
        cpt++;
    }
    for (var _f = 0, _g = b.roofs; _f < _g.length; _f++) {
        var r = _g[_f];
        r.computeUsablePeakPower();
        r.computeRoofProduction();
    }
    return computedPvArea;
};
var optimizeRoofPowers = function (b, actualPower) {
    var computedPower = actualPower;
    var roofProductivities = [];
    for (var _i = 0, _a = b.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        roofProductivities.push(r.productivity);
    }
    var sortRoofProductivities = roofProductivities.sort(function (a, b) { return a - b; });
    var cpt = 0;
    while (constants.MAX_POWER < computedPower && cpt < b.roofs.length && cpt < MAX_ITERATION_WHILE) {
        var deltaPower = computedPower - constants.MAX_POWER;
        for (var _b = 0, _c = b.roofs; _b < _c.length; _b++) {
            var r = _c[_b];
            if (r.productivity === sortRoofProductivities[cpt]) {
                r.usablePeakPower = Math.max((r.usablePeakPower - deltaPower), 0);
            }
        }
        computedPower = 0;
        for (var _d = 0, _e = b.roofs; _d < _e.length; _d++) {
            var r = _e[_d];
            computedPower = computedPower + r.usablePeakPower;
        }
        cpt++;
    }
    for (var _f = 0, _g = b.roofs; _f < _g.length; _f++) {
        var r = _g[_f];
        r.computeRoofProduction();
    }
};
