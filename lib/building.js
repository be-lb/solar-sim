"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var logger = debug('solar-sim:building');
var Building = (function () {
    function Building(the_obstacle_rate, the_MAX_POWER, the_MAX_SOLAR_PRODUCTIVITY) {
        this.obstacleRate = the_obstacle_rate;
        this.roofs = [];
        this.MAX_POWER = the_MAX_POWER;
        this.MAX_SOLAR_PRODUCTIVITY = the_MAX_SOLAR_PRODUCTIVITY;
    }
    ;
    Building.prototype.computeProduction = function () {
        var production = 0;
        for (var _i = 0, _a = this.roofs; _i < _a.length; _i++) {
            var r = _a[_i];
            production = production + r.roofProduction;
        }
        if (production > this.MAX_POWER * this.MAX_SOLAR_PRODUCTIVITY) {
            logger("Warning! Building production too large: " + production);
            production = this.MAX_POWER * this.MAX_SOLAR_PRODUCTIVITY;
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
        if (power > this.MAX_POWER) {
            optimizeRoofPowers(this);
            return this.power = this.MAX_POWER;
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
var MAX_ITERATION_WHILE = 500;
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
var optimizeRoofPowers = function (b) {
    var remainingPower = b.MAX_POWER;
    b.roofs.map(function (r, i) { return ({
        i: i, prod: r.productivity * Math.min(r.usablePeakPower, b.MAX_POWER)
    }); })
        .sort(function (a, b) { return b.prod - a.prod; })
        .forEach(function (_a) {
        var i = _a.i;
        var roof = b.roofs[i];
        if (remainingPower > 0) {
            if (roof.usablePeakPower <= remainingPower) {
                remainingPower -= roof.usablePeakPower;
            }
            else {
                roof.usablePeakPower = remainingPower;
                remainingPower = 0;
            }
        }
        else {
            roof.usablePeakPower = 0;
        }
    });
    for (var _i = 0, _a = b.roofs; _i < _a.length; _i++) {
        var r = _a[_i];
        r.computeRoofProduction();
    }
};
